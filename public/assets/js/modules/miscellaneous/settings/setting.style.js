import { changePassword } from "../../hris/users/user.pasword.js";

document.addEventListener('DOMContentLoaded', () => {
    const tab = document.getElementById('tab');
    const overlay = document.getElementById('overlay-page');
    const contentTab = document.getElementById('tab-content');
    const changePassBtn = document.getElementById('change-password-btn');
    const closeBtn = document.getElementById('closeTab');

    changePassBtn.addEventListener('click', function(){
        tab.classList.add("show");
        overlay.classList.add("show");
        changePassword();
    })

    closeBtn.addEventListener('click', function(){
        tab.classList.remove("show");
        overlay.classList.remove("show");
    })

    overlay.addEventListener('click', function(){
        tab.classList.remove("show");
        overlay.classList.remove("show");
    })
})