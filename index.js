import { extension_settings, getContext } from "../../../extensions.js";
import { eventSource, event_types } from "../../../../script.js";
// นำเข้า Line App ของเรา
import { LineApp } from "./apps/line-messenger/line.js";

let isPhoneOpen = false;

function createPhoneUI() {
    const extensionPanel = document.getElementById('extensions_settings');
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'social-messenger-btn';
    toggleBtn.innerHTML = '📱 Open Messenger';
    toggleBtn.addEventListener('click', togglePhone);
    extensionPanel.appendChild(toggleBtn);

    const phoneContainer = document.createElement('div');
    phoneContainer.id = 'sm-phone-container';

    phoneContainer.innerHTML = `
        <div id="sm-phone-notch"></div>
        <div id="sm-app-display"></div>
    `;

    document.body.appendChild(phoneContainer);

    // เมื่อสร้างเสร็จ ให้โหลดหน้า Home Screen ทันที
    renderHomeScreen();
}

function togglePhone() {
    const phone = document.getElementById('sm-phone-container');
    isPhoneOpen = !isPhoneOpen;
    phone.style.display = isPhoneOpen ? 'block' : 'none';

    // รีเฟรชหน้า Home ทุกครั้งที่เปิดโทรศัพท์
    if (isPhoneOpen) {
        renderHomeScreen();
    }
}

// --------------------------------------------------------
// 🏠 ระบบ Home Screen และ App Manager
// --------------------------------------------------------
function renderHomeScreen() {
    const display = document.getElementById('sm-app-display');

    // สร้างหน้าจอ Home Screen และไอคอนแอป
    display.innerHTML = `
        <div style="padding: 50px 20px 20px 20px; height: 100%; background: #f0f0f0; box-sizing: border-box;">
            <h2 style="color: #333; text-align: center; margin-bottom: 30px; font-family: sans-serif;">Home</h2>

            <div style="display: flex; gap: 20px; justify-content: flex-start; flex-wrap: wrap;">

                <!-- 🟢 ไอคอนแอป Line -->
                <div id="app-icon-line" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 5px;">
                    <div style="width: 60px; height: 60px; background-color: #06C755; border-radius: 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 30px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        L
                    </div>
                    <span style="color: #333; font-size: 12px; font-weight: bold; font-family: sans-serif;">LINE</span>
                </div>

                <!-- ⚪ พื้นที่สำหรับแอปในอนาคต (Dummy) -->
                <div style="display: flex; flex-direction: column; align-items: center; gap: 5px; opacity: 0.5;">
                    <div style="width: 60px; height: 60px; background-color: #ccc; border-radius: 15px;"></div>
                    <span style="color: #333; font-size: 12px; font-family: sans-serif;">Soon</span>
                </div>

            </div>
        </div>
    `;

    // ผูก Event ให้คลิกที่ไอคอน Line แล้วเปิดแอป
    document.getElementById('app-icon-line').addEventListener('click', () => {
        openApp('line');
    });
}

// ฟังก์ชันเปิดแอปพลิเคชัน
function openApp(appName) {
    const display = document.getElementById('sm-app-display');
    const context = getContext(); // ดึงข้อมูลล่าสุดเสมอเมื่อเปิดแอป

    if (appName === 'line') {
        // สร้าง Instance ของ LineApp โดยส่งพื้นที่แสดงผล และฟังก์ชันย้อนกลับไปให้
        const lineApp = new LineApp(display, renderHomeScreen);
        lineApp.render(context);
    }
}

jQuery(async () => {
    console.log("📱 Social Media Messenger Extension Loaded!");
    createPhoneUI();
});
