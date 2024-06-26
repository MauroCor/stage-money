document.addEventListener("DOMContentLoaded", function() {
    var bodyCells = document.querySelectorAll('.cell-value');

    // Money format
    bodyCells.forEach(function(cell) {
        var cellText = cell.textContent.trim();
        var cellNumber = parseFloat(cellText.replace(/[^\d.-]/g, ''));
        if (isNaN(cellNumber)) {
            cell.textContent = '';
        } else {
            var formattedNumber = cellNumber.toLocaleString('es-ES', { maximumFractionDigits: 0 });
            if (cellNumber < 0) {
                formattedNumber = "-$" + formattedNumber.slice(1);
            } else {
                formattedNumber = "$" + formattedNumber;
            }
            cell.textContent = formattedNumber;
        }
    });

    document.querySelectorAll('.nav-link').forEach(function(link) {
        if (link.getAttribute("href") === window.location.pathname) {
            link.classList.add("selected");
        }
    });
});

function setValue(btn, inputId) {
    var value = btn.value;
    var input = document.getElementById(inputId);
    var prevSelectedButton = document.querySelector('.input_buttons button.selected');
    if (prevSelectedButton) {
        prevSelectedButton.classList.remove('selected');
    }
    if (!btn.classList.contains('selected')) {
        btn.classList.add('selected');
        input.value = value;
    }
}

function setMonth(btn, inputId) {
    var month = btn.value;
    var input = document.getElementById(inputId);
    var prevSelectedButton = document.querySelector('.month_buttons button.selected');
    var span = document.getElementById(inputId + '_error');
    if (prevSelectedButton) {
        prevSelectedButton.classList.remove('selected');
    }
    if (!btn.classList.contains('selected')) {
        btn.classList.add('selected');
        input.value = month;
        span.style.display = 'none';
    }
}

function resetForm(form) {
    var monthSelected = form.querySelector('.month_buttons button.selected');
    var nameSelected = form.querySelector('.input_buttons button.selected');
    form.reset();
    if (monthSelected) {
        monthSelected.classList.remove('selected');
        form.querySelector('.month_buttons input').removeAttribute('value');}
    if (nameSelected) {
        nameSelected.classList.remove('selected');}
    form.querySelector('.error-message').style.display = "none";
    form.style.display = "none";
}

function addSubmit(form, id) {
    form.addEventListener("submit", function() {
        if (!document.getElementById(id).value) {
            event.preventDefault();
            form.querySelector('.error-message').style.display = "block";
        }
    });
}

// Edit cells section
var editingMode = false;

function setSelectedCell(cell) {
    var editBtn = document.getElementById('edit-cells-btn');
    if (!editingMode) {
        var selectedCell = document.querySelector('.item-name.selected');
        if (selectedCell && selectedCell !== cell) {
            selectedCell.classList.remove('selected');
        }
        if (!cell.classList.contains('editing')) {
            cell.classList.toggle('selected');
            editBtn.style.display = cell.classList.contains('selected') ? 'inline-block' : 'none';
        }
    }
}

function setEdit() {
    var selectedCell = document.querySelector('.item-name.selected');
    var editBtn = document.getElementById('edit-cells-btn');
    var okEditBtn = document.getElementById('ok_edit_btn');
    var cancelEditBtn = document.getElementById('cancel_edit_btn');
    if (!editingMode) {
        editingMode = true;
        selectedCell.contentEditable = true;
        selectedCell.focus();
        selectedCell.classList.add('editing');
        okEditBtn.style.display = 'inline-block';
        cancelEditBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
    }
    return selectedCell.textContent.trim();
}

function setOkEdit(oldName) {
    var selectedCell = document.querySelector('.item-name.selected');
    var okEditBtn = document.getElementById('ok_edit_btn');
    var cancelEditBtn = document.getElementById('cancel_edit_btn');
    var newName = selectedCell.textContent.trim();
    var feature = /cell-(.*?)-name/.exec(selectedCell.classList[0])[1];
    fetch(`/edit-${feature}/${encodeURIComponent(oldName)}/${encodeURIComponent(newName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                }
                editingMode = false;
                selectedCell.contentEditable = false;
                selectedCell.classList.remove('editing');
                selectedCell.classList.remove('selected');
                okEditBtn.style.display = 'none';
                cancelEditBtn.style.display = 'none';
            } else {
                alert(data.err_msg);
            }
        });
}

function setCancelEdit(oldName) {
    var selectedCell = document.querySelector('.item-name.selected');
    editingMode = false;
    selectedCell.contentEditable = false;
    selectedCell.textContent = oldName;
    selectedCell.classList.remove('editing');
    document.getElementById('ok_edit_btn').style.display = 'none';
    document.getElementById('cancel_edit_btn').style.display = 'none';
    document.getElementById('edit-cells-btn').style.display = 'inline-block';
}

function setLineThrough(cell) {
    var id = cell.getAttribute('data-id');
    var done = localStorage.getItem(id) === 'true';
    done = !done;
    if (done) {
        cell.classList.add('done');
    } else {
        cell.classList.remove('done');
    }
    localStorage.setItem(id, done ? 'true' : 'false');
}

function toggleColumn(columnIndex) {
    var table = document.getElementById("fixed-columns-table");
    var headerCell = table.querySelector("thead th:nth-child(" + (columnIndex + 1) + ")");
    var tbodyCells = table.querySelectorAll("tbody td:nth-child(" + (columnIndex + 1) + ")");
    headerCell.classList.toggle("hide-col");
    tbodyCells.forEach(function(cell) {
    cell.classList.toggle("hide-col");
    });
}

function pastMonths() {
    var currentMonth = new Date().getMonth() + 1;
    var columns = document.querySelectorAll("thead th[onclick]");
    columns.forEach(function(col, index) {
        var monthNumber = index + 1;
        if (monthNumber < currentMonth) {
            col.click();
        }
    });
}
