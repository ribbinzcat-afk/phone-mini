export class LineApp {
    constructor(displayContainer, goBackCallback) {
        this.container = displayContainer;
        this.goBack = goBackCallback; // ฟังก์ชันสำหรับกดปุ่ม Back กลับไปหน้า Home
    }

    // ฟังก์ชันเริ่มโหลดแอป
    render(context) {
        // 1. โหลด CSS ของ Line (ถ้ายังไม่ได้โหลด)
        if (!document.getElementById('line-app-css')) {
            const link = document.createElement('link');
            link.id = 'line-app-css';
            link.rel = 'stylesheet';
            // *สำคัญ*: ตรวจสอบชื่อโฟลเดอร์ extension ของคุณตรงนี้
            link.href = '/scripts/extensions/phone-mini/apps/line-messenger/line.css';
            document.head.appendChild(link);
        }

        // 2. ดึงข้อมูลตัวละครและแชท
        const chatHistory = context.chat || [];
        const characters = context.characters || {};
        const currentCharacterId = context.characterId;

        let charName = "Unknown";
        let charAvatar = "";

        if (currentCharacterId !== undefined && characters[currentCharacterId]) {
            charName = characters[currentCharacterId].name;
            charAvatar = `/characters/${characters[currentCharacterId].avatar}`;
        }

        // 3. สร้างโครงสร้าง HTML ของแอป Line
        this.container.innerHTML = `
            <div class="line-app">
                <div class="line-header">
                    <div class="line-back-btn" id="line-back-btn">◀</div>
                    <div class="line-char-name">${charName}</div>
                </div>
                <div class="line-chat-container" id="line-chat-container">
                    <!-- ข้อความแชทจะถูกสร้างและใส่ตรงนี้ด้วย JS -->
                </div>
            </div>
        `;

        // 4. ผูก Event ปุ่มย้อนกลับ
        document.getElementById('line-back-btn').addEventListener('click', () => {
            this.goBack();
        });

        // 5. เรนเดอร์ข้อความแชท
        const chatContainer = document.getElementById('line-chat-container');

        chatHistory.forEach(msg => {
            if (msg.is_system) return; // ข้ามข้อความระบบ

            const isUser = msg.is_user;
            const messageDiv = document.createElement('div');
            messageDiv.className = `line-message ${isUser ? 'user' : 'ai'}`;

            // ถ้าเป็น AI ให้แสดงรูปโปรไฟล์ ถ้าเป็น User ไม่ต้องแสดง
            const avatarHTML = isUser ? '' : `<img src="${charAvatar}" class="line-avatar" onerror="this.src='/img/ai-avatar.png'">`;

            // แปลง \n เป็น <br> เพื่อให้ขึ้นบรรทัดใหม่ได้ถูกต้อง
            const textContent = msg.mes.replace(/\n/g, '<br>');

            messageDiv.innerHTML = `
                ${avatarHTML}
                <div class="line-bubble">${textContent}</div>
            `;
            chatContainer.appendChild(messageDiv);
        });

        // เลื่อนหน้าจอลงไปที่ข้อความล่าสุดเสมอ
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}
