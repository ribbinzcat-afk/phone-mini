import { extension_settings, getContext } from "/scripts/extensions.js";

// ตัวแปรเก็บสถานะการเปิด/ปิดโทรศัพท์
let isPhoneOpen = false;

// ฟังก์ชันสร้าง UI โทรศัพท์
function createPhoneUI() {
    // 1. สร้างปุ่มเปิดโทรศัพท์ที่เมนูขวา
    const extensionPanel = document.getElementById('extensions_settings');
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'social-messenger-btn';
    toggleBtn.innerHTML = '📱 Open Messenger';
    toggleBtn.addEventListener('click', togglePhone);
    extensionPanel.appendChild(toggleBtn);

    // 2. สร้างกรอบโทรศัพท์
    const phoneContainer = document.createElement('div');
    phoneContainer.id = 'sm-phone-container';

    phoneContainer.innerHTML = `
        <div id="sm-phone-notch"></div>
        <div id="sm-app-display">
            <!-- แอปต่างๆ จะถูกโหลดมาใส่ตรงนี้ -->
            <div style="padding: 40px 20px; text-align: center; color: black;">
                <h2>Home Screen</h2>
                <p>Welcome to Social Messenger</p>
                <button id="sm-test-data-btn" style="padding: 10px; cursor: pointer;">Test Data Binding</button>
            </div>
        </div>
    `;

    document.body.appendChild(phoneContainer);

    // ปุ่มทดสอบดึงข้อมูล
    document.getElementById('sm-test-data-btn').addEventListener('click', testDataBinding);
}

// ฟังก์ชัน เปิด/ปิด โทรศัพท์
function togglePhone() {
    const phone = document.getElementById('sm-phone-container');
    isPhoneOpen = !isPhoneOpen;
    phone.style.display = isPhoneOpen ? 'block' : 'none';
}

// --------------------------------------------------------
// 🧠 ส่วนของ Data Binding (ดึงข้อมูลจาก SillyTavern)
// --------------------------------------------------------
function testDataBinding() {
    const context = getContext();

    // ดึงประวัติแชท
    const chatHistory = context.chat;

    // ดึงข้อมูลตัวละครที่กำลังคุยอยู่
    const currentCharacterId = context.characterId;
    const characters = context.characters;

    if (!chatHistory || chatHistory.length === 0) {
        alert("ยังไม่มีประวัติการแชทเลยครับ!");
        return;
    }

    let charName = "AI";
    let charAvatar = "";

    // หาชื่อและรูปภาพของตัวละคร
    if (currentCharacterId !== undefined && characters[currentCharacterId]) {
        charName = characters[currentCharacterId].name;
        charAvatar = `/characters/${characters[currentCharacterId].avatar}`;
    }

    // แสดงข้อมูลใน Console เพื่อให้แน่ใจว่าดึงข้อมูลสำเร็จ
    console.log("=== 📱 Social Messenger Data Binding Test ===");
    console.log("Character Name:", charName);
    console.log("Character Avatar URL:", charAvatar);
    console.log("Total Messages:", chatHistory.length);
    console.log("Last Message:", chatHistory[chatHistory.length - 1]);

    alert(`ดึงข้อมูลสำเร็จ!\nตัวละคร: ${charName}\nจำนวนข้อความ: ${chatHistory.length}\n(ดูรายละเอียดใน F12 Console)`);
}

// เริ่มทำงานเมื่อ Extension ถูกโหลด
jQuery(async () => {
    console.log("📱 Social Media Messenger Extension Loaded!");
    createPhoneUI();
});
