(() => {
    const table = document.querySelector('table tbody');
    for(let i = 1; i < 10; i++) {
        let html = '<tr>';
        for(let j = 2; j < 10; j++) {
            html += `<td>${j} * ${i} = ${j * i}</td>`;
        }
        html += '</tr>';
        table.innerHTML = table.innerHTML + html;
    }
})();