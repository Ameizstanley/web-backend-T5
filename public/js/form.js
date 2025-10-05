const showPswdBtn = document.querySelector('#showPswd');

showPswdBtn.addEventListener('click', () => {
    const pswdInput = document.querySelector('#account_password')
    const pswdType = pswdInput.getAttribute('type');

    if (pswdType === 'password') {
        pswdInput.setAttribute('type', 'text');
        showPswdBtn.textContent = 'Hide Password';
    }else{
        pswdInput.setAttribute('type', 'password');
        showPswdBtn.textContent = 'Show Password';
    }
})