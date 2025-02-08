// Input the topright row, column, as well as the bottomleft row, column of the slice to be obtained.
function arr2d_slice(arr_2d, topleft_row, topleft_col, bottomright_row, bottomright_col) {
    // Ensure within bounds.
    if (
        !(topleft_col >= 0)     || !(topleft_col < arr_2d[0].length) ||
        !(bottomright_row >= 0) || !(bottomright_row < arr_2d.length) ||
        !(bottomright_col >= 0) || !(bottomright_col < arr_2d[0].length)
    ) {
        console.group("arr2d_slice(): Given indices are out of bounds of given 2d array.");
        console.log("The following are the given indices:",topleft_row,topleft_col,bottomright_row,bottomright_col);
        console.log("The indices can be at most:",arr_2d.length - 1,arr_2d[0].length - 1,arr_2d.length - 1,arr_2d[0].length - 1);
        console.log("The following was the given array.");
        console.log(arr_2d);
        console.groupEnd();
        return []
    }
    
    slice = []
    for (var i = topleft_row; i <= bottomright_row; i++) {
        var row = arr_2d[i];
        slice.push(row.slice(topleft_col,bottomright_col + 1));
    }
    return slice
}