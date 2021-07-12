let arrValue = [
    {'id': '1', 'customerName': 'WEF Product','customer':'12234', 'invoice': '213156488', 'invoiceAmount': '122.8k', 'dueDate': '23-Jan-2020', 'predictedPaymentDate': '--', 'notes': 'lorem'},
    {'id': '2', 'customerName': 'DEF Product','customer':'56789', 'invoice': '452156488', 'invoiceAmount': '122.8k', 'dueDate': '23-Jan-2020', 'predictedPaymentDate': '--', 'notes': 'lorem'},
    {'id': '3', 'customerName': 'GHI Product','customer':'98765', 'invoice': '452156488', 'invoiceAmount': '122.8k', 'dueDate': '23-Jan-2020', 'predictedPaymentDate': '--', 'notes': 'lorem'},
    {'id': '4', 'customerName': 'JKL Product','customer':'34743', 'invoice': '452156488', 'invoiceAmount': '122.8k', 'dueDate': '23-Jan-2020', 'predictedPaymentDate': '--', 'notes': 'lorem'},]

let selectedRowsArr = [];

// Function to open Modal
const openModal = (modalFor) => {
    getModalContent(modalFor);
    $('.modal-window').addClass("is-visible");
};

// Function to close Modal
const closeModal = () => {
    $(".modal-window").removeClass("is-visible");
};

const selectedRow = (selRows) => {
    if(selRows.checked) {
        selectedRowsArr.push(selRows.id);

        if ($('.checkbox:checked').length == $('.checkbox').length ){
            $("#checkAll").prop('checked', true);
        }
    } else {
        const index = selectedRowsArr.indexOf(selRows.id);

        if (index > -1) {
            selectedRowsArr.splice(index, 1);
        }
        $("#checkAll").prop('checked', false);
    }
    
    disableEditButton();
    disableDeleteButton();
}

// Disable/Enable Delete Button
const disableDeleteButton = () => {
    console.log(selectedRowsArr.length);
    if(selectedRowsArr.length >= 1) {
        $('button.delete').prop("disabled", false);
    } else {
        $('button.delete').prop("disabled", true);
    }
}

// Disable/Enable Edit Button
const disableEditButton = () => {
    if(selectedRowsArr.length === 1) {
        $('button.edit').prop("disabled", false);
    } else {
        $('button.edit').prop("disabled", true);
    }
}

const createButton = (name, functionName, className) => {
    return `<button class="`+ className +`" onClick="`+ functionName +`"> `+ name +`</button>`;
}

const deleteRow = () => {
    $.each(selectedRowsArr, (key, value) => {
        const index = arrValue.findIndex(row => row.id === value);
        if (index > -1) {
            arrValue.splice(index, 1);
        }
    });

    selectedRowsArr = [];
    if(arrValue.length < 1) {
        $('#checkAll').prop('checked', false);
    }
    retrieveTableData ();
    closeModal();
}

const editRow = () => {
    if($('#invoiceAmount').val() && $('#notes').val() && selectedRowsArr.length === 1) {
        const index = arrValue.findIndex(row => row.id === selectedRowsArr[0]);
        arrValue[index].invoiceAmount = $('#invoiceAmount').val();
        arrValue[index].notes = $('#notes').val();
       
        selectedRowsArr = [];
        retrieveTableData ();
        closeModal();
    }
}

// Generate Modal Content
const getModalContent = (modalFor) => {
    let modalHeading = '';
    let modalContent = '';
    let modalButton = '';
    let modalWidth = '860px';

    if (modalFor === 'add') {
        modalButton = ` `+ createButton('Cancel', "closeModal()", "cancel-button" ) +`
                        <div class="alignRight">
                            `+ createButton('Clear', "resetElement()", "modal-button" ) +`
                            `+ createButton('Add', "addNewRow()", "modal-button" ) +`
                        </div>`;

        modalHeading = 'Add Invoice';
        modalContent = `<div class="left-block">
                            <div class="label-wrapping">
                                <label for="customer name">Customer name*</label>

                                <input type="text" id="fname" name="fname" value="" />
                            </div>
                            <div class="label-wrapping">
                                <label for="customer number">Customer number*</label>
                                <input type="text" id="lname" name="lname" value="" />
                            </div>
                            <div class="label-wrapping">
                                <label for="Invoice number ">Invoice number*</label>
                                <input type="text" id="lname" name="lname" value="" />
                            </div>
                            <div class="label-wrapping">
                                <label for="Invoice id">Invoice id*</label>
                                <input type="text" id="lname" name="lname" value="" />
                            </div>
                        </div>

                        <div class="right-block">
                            <div class="label-wrapping">
                                <label for="date">date*</label>
                                <input type="date" />
                            </div>
                            <div class="label-wrapping">
                                <label for="Notes">Notes*</label>
                                <textarea name="Notes" id="" cols="30" rows="10"></textarea>
                            </div>
                        </div>`;

    } else if (modalFor === 'edit') {
        let getSelectedRow = arrValue.filter(row => row.id === selectedRowsArr[0]);
        modalWidth = '395px';
        modalHeading = 'Edit Invoice';

        modalButton = ` `+ createButton('Cancel', "closeModal()", "cancel-button" ) +`
                        <div class="alignRight">
                            `+ createButton('Reset', "resetElement()", "modal-button" ) +`
                            `+ createButton('Save', "editRow()", "modal-button" ) +`
                        </div>`;

        modalContent = `<div><div class="label-wrapping">
                            <label for="customer name">Invoice Amount</label>

                            <input type="text" id="invoiceAmount" name="invoiceAmount" value="`+ getSelectedRow[0].invoiceAmount +`" />
                        </div>
                        <div class="label-wrapping">
                            <label for="Notes">Notes*</label>
                            <textarea name="Notes" id="notes" cols="30" rows="10">`+ getSelectedRow[0].notes +`</textarea>
                        </div></div>`;
    } else {
        modalHeading = 'Delete record(s)';
        modalButton = `<div class="alignRight">
                            `+ createButton('Cancel', "closeModal()", "modal-button" ) +`
                            `+ createButton('Delete', "deleteRow()", "modal-button" ) +`
                        </div>`;
        modalContent = `<p>You will lose your record(s) after this action.We can't recover them once you delete.</p>
        <p>Are you sure you want to <span class="color-red">permanently delete</span> them?</p>`;
    }

    let modalData =  `<div class="modal-content" style='max-width:`+ modalWidth +`'>
                <div class="modal-header">
                    <h3>`+ modalHeading +`</h3>
                    <button class="close" onclick="closeModal()"></button>
                </div>

                <div class="modal-body `+ modalFor +`">
                    `+ modalContent +`
                </div>
                <div class="modal-footer `+ modalFor +`">
                    `+ modalButton +`
                </div>
            </div>`;

    $('.modal-window').empty().append(modalData);
}

// Search Functionality
const searchContent = () => {
    let searchTerm = $('.search').val().toLowerCase();

    $('.table-content tr').each(function(){
        let rowData = $(this).find('.invoice-number').text().toLowerCase();
        if(rowData.indexOf(searchTerm) === -1){
            $(this).hide();
        } else {
            $(this).show();
        }
    });

    $(".rowData").is(":visible") ? $(".hideMe").hide() : $(".hideMe").show();
};

// Function to get Data from Array
const retrieveTableData = () => {
    let content = '';
    $.each(arrValue, (key, value) => {
        content += `<tr class="rowData">
                        <td>
                            <label class="checkbox-wrapper">
                                <input type="checkbox" class="checkbox" id="`+ value.id +`" onclick="return selectedRow(this)"/>
                                <span class="checkmark"></span>
                            </label>
                        </td>
                        <td>`+ value.customerName +`</td>
                        <td>`+ value.customer +`</td>
                        <td class="invoice-number">`+ value.invoice +`</td>
                        <td>`+ value.invoiceAmount +`</td>
                        <td>`+ value.dueDate +`</td>
                        <td>`+ value.predictedPaymentDate +`</td>
                        <td>`+ value.notes +`</td>
                    </tr>`;
    });

    content += '<tr class="hideMe"><td colspan="8"> No data Found</td></tr>'

    $('.table-content').empty().append(content);

    disableEditButton();
    disableDeleteButton();
}


const addNewRow = () => {
    
        const index = arrValue.findIndex(row => row.id === selectedRowsArr[0]);
        arrValue[index].invoiceAmount = $('#invoiceAmount').val();
        arrValue[index].Customername = $('#notes').val();
        arrValue[index].Customernumber = $('#notes').val();
        arrValue[index].Invoicenumber = $('#notes').val();
        arrValue[index].Invoiceid = $('#notes').val();
        arrValue[index].date = $('#notes').val();
        arrValue[index].notes = $('#notes').val();
        arrValue[index].push()
       
        selectedRowsArr = [];
        retrieveTableData ();
        closeModal();


}

const resetElement = () => {
    // Write Add Functionality
}

$( document ).ready(function() {
    retrieveTableData();
    $("#checkAll").change(function() {
        if($(this).prop("checked")) {
            selectedRowsArr = [];
            $('.checkbox').prop('checked', false);
        }
        $(".checkbox").click(); 
    });

});