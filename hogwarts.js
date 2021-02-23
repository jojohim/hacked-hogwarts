"use strict";

window.addEventListener("DOMContentLoaded", start);

let studentsGlobalArray = [];
let globalStudents = [];


//OBJECT FOR FILTERING AND SORTING 
let settings = {
    filterBy: "All",
    sortBy: "all",
    sortDir: "",
}

//variables for filtering
let houseButton = document.getElementById("housefilter");

//variables for sorting
let listItems = document.querySelectorAll("[data-action=sort]");

//variables for pop-up 
let numbersButton = document.getElementById("more-details");


let studentTemplate = {
    fullname:"",
    gender:"",
    house: "",
}


function start() {
    loadJSON();

    //Add event listeners for filters and sorts
        houseButton.addEventListener("change", checkFilter);

        listItems.forEach((listItem) => {
            listItem.addEventListener("click", checkSort);
        });

    //Event listeners for numbers pop-up
        numbersButton.addEventListener("click", openNumberPopup);

    //Add event listeners for filters, etc

}

async function loadJSON() {
    const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    const jsonData = await response.json();

    //when loaded, prepare data objects
    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
    studentsGlobalArray = jsonData.map(prepareObject);
    // call clean students to then call for each 
    cleanStudents(studentsGlobalArray);
    displayData(globalStudents);

}

function prepareObject(jsonObject){
 const student = Object.create(studentTemplate);
 
 student.fullname = jsonObject.fullname;
 student.house = jsonObject.house;
 student.gender = jsonObject.gender;

 return student;
}

function displayTable(students) {
    //clear list
    document.querySelector("#list tbody").innerHTML = "";
    //create new list for each student
    students.forEach(displayStudent);
}

function displayStudent(student) {
    //create clone
    const copy = document.querySelector("template#student").content.cloneNode(true);
    //fill template 
    copy.querySelector("[data-field=firstName]").textContent = student.firstName;
    copy.querySelector("[data-field=middleName]").textContent = student.middleName;
    copy.querySelector("[data-field=lastName]").textContent = student.lastName;
    copy.querySelector("[data-field=nickName]").textContent = student.nickName;
    copy.querySelector("[data-field=house]").textContent = student.house;

    if (student.expelled == true) {
    copy.querySelector("[data-field=expelled]").textContent = "✔"; 
    } else {
    copy.querySelector("[data-field=expelled]").textContent = "expell"; 
    }

    copy.querySelector("[data-field=expelled]").addEventListener("click", clickExpell);

    function clickExpell(){
        student.expelled = ! student.expelled;
        console.log(student.expelled);

        buildList();
    }

    //append clone 
    document.querySelector("#list tbody").appendChild(copy);
}

function cleanStudents(students){
    console.log(students);

    students.forEach(student => {
    const cleanedStudentObject = getItems(student);
    globalStudents.push(cleanedStudentObject);
    });
    console.table(globalStudents);
}

function getItems(student){
    const nameObject = splitNames(student.fullname);
    const studentHouse = cleanItems(student.house).trim();
    const imageURL = `${nameObject.lastName.toLowerCase()}_${nameObject.firstName.charAt(0).toLowerCase()}.png`;

    return {
        firstName: nameObject.firstName,
        lastName: nameObject.lastName,
        middleName: nameObject.middleName,
        nickName: nameObject.nickName,
        house: studentHouse,
        imageUrl: imageURL,
        expelled: false,
        prefect: undefined,
        squadMember: undefined,

    }
}

function splitNames(fullname) {

    const nameObject = {
        // Start these two with undefined, in case that the student doesn't have any 
        // middle or nickname (the student will always have a firstName and a lastName)
        nickName: "N/A",
        middleName: "N/A",
    };

    const names = fullname.trim().split(' ');

    names.forEach((name, index) => {
        if (index === 0) {
            // Combines first letter at index 0 and uppercase it, and then combines it
            // with the rest of the name (from index 1) and set it to lowercase
            nameObject.firstName = cleanItems(name);   
        }

        // If index is not 0 or names.length - 1 (last index) (last name or first name)
        if (index !== 0 && index !== names.length - 1) {

            
            // If this is a nickname (starts and ends with ")
            if (name[0] == '"' && name[name.length - 1] == '"' ) {
                nameObject.nickName = cleanItems(name);
            } else {
                nameObject.middleName = cleanItems(name);   
            }
        }

        if (index === names.length - 1) {
            nameObject.lastName = cleanItems(name);   
        }
    })

    return nameObject;
}

function cleanItems(item){
    let itemWithoutQuotationMarks = item.replaceAll('"', '');
    const hyphenIndex = itemWithoutQuotationMarks.indexOf('-');

    if (hyphenIndex > -1) {
        // Split names into two names (easier to handle)
        const hypenNames = itemWithoutQuotationMarks.split('-');

        // Combine names + add uppercase to the latter name in the hyphen
        itemWithoutQuotationMarks = `${hypenNames[0]}-${hypenNames[1].charAt(0).toUpperCase()}${hypenNames[1].slice(1)}`
        return itemWithoutQuotationMarks;
    }
    return `${itemWithoutQuotationMarks.charAt(0).toUpperCase()}${itemWithoutQuotationMarks.slice(1).toLowerCase()}`;
}

function displayData(students){
    displayTable(students);
    //displayNumbers();
}
//SEARCHING

function searchForStudent(){
    let input = document.getElementById("searchbar").value;
}

//POPUPS
function openStudentPopup() {
}

function createModal(student){
//create copy of template
const copy = document.querySelector("template#student-popup").content.cloneNode(true);
//populate copy
copy.querySelector("h4 #name").innerHTML = student.fullname;
//append copy
document.querySelector("#info-wrapper").appendChild(copy);
}

function openNumberPopup(){
    //console.log("clicked");
    let numberPopUp = document.getElementById("number-popup");
    let closeButton = document.getElementById("close-numbers");

    numberPopUp.style.display = "flex";

    closeButton.addEventListener('click', function() {
        numberPopUp.style.display = "none";
    });


}

function getNumbers(){

}

//FILTERS 
function checkFilter(event) {
    //filter = event.target.dataset.filter;
    const filter = houseButton[houseButton.selectedIndex].value;
    console.log(filter);
    setFilter(filter);
}

function setFilter(filter){
settings.filterBy = filter;
buildList();
}

function filterStudents(filteredStudents) {
    //console.log(optionSelected);
    //let filteredStudents = [];
    switch(settings.filterBy) {
        case "All":
            filteredStudents = globalStudents.filter(isAll);
            break;
        case "Gryffindor":
            filteredStudents = globalStudents.filter(isGryffindor);
            break;
        case "Ravenclaw":
            filteredStudents = globalStudents.filter(isRavenclaw);
            break;
        case "Hufflepuff":
            filteredStudents = globalStudents.filter(isHufflepuff);
            break;
        case "Slytherin":
            filteredStudents = globalStudents.filter(isSlytherin);
            break;
    }

return filteredStudents;

}

function isExpelled(student) {    
}

function isNotExpelled(student) {    
}

function isHufflepuff(student){
    if(student.house === "Hufflepuff"){
        return true;
    }
    else{
        return false;
    }
}

function isGryffindor(student){
    if(student.house === "Gryffindor"){
        return true;
    }
    else{
        return false;
    }
}

function isSlytherin(student){
    if(student.house === "Slytherin"){
        return true;
    }
    else{
        return false;
    }
}

function isRavenclaw(student){
    if(student.house === "Ravenclaw"){
        return true;
    }
    else{
        return false;
    }
}

function isAll(student){
    return true;

}

//SORTING 
function checkSort(event) {

    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection

    //toggle direction 
    if(settings.sortDir === "asc"){
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }

    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir){
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
}

function sortStudents(sortedList){

    let direction = 1;
    if(settings.sortDir === "desc") {
        direction = -1
    } else {
        direction = 1;
    }

    sortedList = sortedList.sort(sortBySort);

    function sortBySort(studentA, studentB) {
        if(studentA[settings.sortBy] < studentB[settings.sortBy]) {
            return -1 * direction;
            }
            else {
                return 1 * direction;
            }
    }
    return sortedList;
}

//BUILD LIST 
function buildList(){
const currentList = filterStudents(globalStudents);
const sortedList = sortStudents(currentList);
displayTable(sortedList);
}

//HOUSE COLOURS AND CREST 
function getHouse(student){
}

function displayCrestAndColours(house){
}

//CHECK FOR EXPELL, SQUAD AND PREFECT
function checkDetails() {
    //toggle expell to make expelled true and false 
toggleExpell();
    //toggle squad member 
toggleSquadMember();
    //toggle prefect
togglePrefect();
}

function toggleSquadMember(){
    //if state false add as squad member 
    //if state true delete as squad member
} 

function togglePrefect(){
    //deletes last prefect and adds new one
}

//NUMBERS
function displayNumbers(){
}

function getNumbers(){
}

//HACKING


