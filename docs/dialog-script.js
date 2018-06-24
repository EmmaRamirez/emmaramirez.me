window.addEventListener('DOMContentLoaded', function () {
    const dialog = document.getElementById('dialog');
    console.log(dialog);
    document.getElementById('open').addEventListener('click', function () {
        dialog.show();
    });
    Array.from(document.querySelectorAll('.close'))
        .forEach(function (f) {
            f.addEventListener('click', function () {
                dialog.close();
            })
        });
});