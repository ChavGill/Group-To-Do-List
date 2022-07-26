// setting up varibles for event listeners for deleting and marking complete/uncomplete
const deleteBtn = document.querySelectorAll('.fa-trash')  
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//Listening for click to delete Item 
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
//Listening for click to mark complete
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
//Function to uncomplete task
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})


//event listener function for delete button 
async function deleteItem(){
    //selecting the item text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending the item text to the server and marking it for deletion
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //getting the response from the server with item deleted from the database
        const data = await response.json()
        //logging the response
        console.log(data)
        //reloading the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//event listener funtion for mark complete button
async function markComplete(){
    //selecting the item text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending the item text to the server marking it completed
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //getting the response from the server
        const data = await response.json()
        //logging the response
        console.log(data)
        //reloading the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}
//Function to mark as uncomplete task
async function markUnComplete(){
    //selecting the item text
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        //sending the item text to the server
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //getting the response from the server
        const data = await response.json()
        //logging the response 
        console.log(data)
        //reloading the page
        location.reload()

        //catching the error
    }catch(err){
        //logging the error
        console.log(err)
    }
}