var client = require("smartsheet");
var ColumnName = new Map();
var smartsheet = client.createClient({ accessToken: "tmi7n6k4o578k95ijr5yy0ws6u" });
smartsheet.users.getCurrentUser().then(user => {
    console.log(user);
}).catch(err => {
    console.log(err);
})
var updateRows = [];
smartsheet.sheets.getSheet({ id: 6551196648400772 }).then(sheet => {
    sheet.columns.forEach(column => {
        ColumnName.set(column.id, column.title);
    })
    console.table(ColumnName);
    var dataArray = [];
    sheet.rows.forEach(row => {
        var data = [];
        var rowUpdate = {
            id: row.id,
            cells: []
        };
        var rowToInsert = {}
        row.cells.forEach(cell => {
            data.push(cell.value);
            rowToInsert[ColumnName.get(cell.columnId)] = cell.value;
            if (cell.value == "Value not available") {
                rowUpdate.cells.push(
                    {
                        columnId: cell.columnId,
                        value: "Not Defined"
                    }
                        );
            }
        });
        if(rowUpdate.cells.length > 0){
            updateRows.push(rowUpdate);
        }
        dataArray.push(rowToInsert);
        var doUpdate = {
            body: updateRows,
            sheetId: sheet.id
        }
        if (updateRows.length > 0) {
            smartsheet.sheets.updateRow(doUpdate).then(res => {
                console.log("Rows updated in sheet");
            }).catch(err => {
                console.log(err);
                console.table(updateRows)
            })
        }
    });
    console.table(dataArray)
})