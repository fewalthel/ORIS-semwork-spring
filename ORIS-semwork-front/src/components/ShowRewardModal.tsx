import type {Reward} from "@types/models";
import Swal from "sweetalert2";

export const ShowRewardModal = (reward: Reward, imageURL: string) => {
    if (!reward) {
        console.error("Reward is undefined");
        return;
    }

    const escapeHtml = (unsafe: string) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };
    const safeName = escapeHtml(reward.name);
    const safeDescription = escapeHtml(reward.description);

    Swal.fire({
        title: '<h3 style="margin: 0; padding: 0; text-align: center;">You have received a new reward</h3>',
        html: `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 10px;
                text-align: center;
                width: 100%;
            ">
                ${imageURL ?
            `<img src="${imageURL}" 
                 alt="Награда: ${safeName}" 
                 style="
                    max-width: 320px;
                    max-height: 320px;
                    border-radius: 8px;
                    margin: 10px auto;
                    object-fit: contain;
                    display: block;
                 "/>` :
            `<div style="
                width: 200px;
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f0f0f0;
                border-radius: 8px;
                color: #666;
                margin: 0 auto;
             ">  </div>`}
                <div style="width: 100%; text-align: center;">
                    <strong style="
                        font-size: 1.2em;
                        text-align: center;
                        margin: 5px 0;
                        display: block;
                    ">
                        ${safeName}
                    </strong>
                    <p style="
                        margin: 5px 0;
                        text-align: center;
                        max-width: 100%;
                        display: block;
                    ">
                        ${safeDescription}
                    </p>
                </div>
                
                <p style="text-align: center; margin: 10px 0 0 0;">
                   you can see all rewards in 
                    <a href="/profile" class="profile-link">
                       your profile
                    </a>
                </p> 
            </div>
        `,
        confirmButtonText: 'Great!',
        showClass: {
            popup: 'swal2-show',
            backdrop: 'swal2-backdrop-show'
        },
        hideClass: {
            popup: 'swal2-hide',
            backdrop: 'swal2-backdrop-hide'
        },
        willClose: () => {
            if (imageURL) {
                URL.revokeObjectURL(imageURL);
            }
        },
        focusConfirm: true,
        backdrop: true,
        allowEscapeKey: true,
        allowOutsideClick: false,
        customClass: {
            popup: 'swal2-popup reward-modal',
            confirmButton: 'swal2-confirm reward-confirm-btn'
        }
    });
};