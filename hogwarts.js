"use strict";

window.addEventListener("DOMContentLoaded", start);

let studentsGlobalArray = [];
let globalStudents = [];
let houseSelected;
let statusSelected;
let sort;

let houseFilter = document.querySelector("#housefilter");
let listItems = document.querySelectorAll("[data-action=sort]");
console.log(listItems);

let studentTemplate = {
    fullname:"",
    gender:"",
    house: "",
}

function start() {
    loadJSON();

    //Add event listeners for filters and sorts
        houseFilter.addEventListener("change", checkFilter);

        listItems.forEach((listItem) => {
            listItem.addEventListener("click", checkSort);
        });
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
    copy.querySelector("[data-field=firstname]").textContent = student.firstName;
    copy.querySelector("[data-field=middlename]").textContent = student.middleName;
    copy.querySelector("[data-field=lastname]").textContent = student.lastName;
    copy.querySelector("[data-field=nickname]").textContent = student.nickName;
    copy.querySelector("[data-field=house]").textContent = student.house;
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
        expelled: undefined,
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

//UNHIDE POPUPS ONCLICK
function openStudentPopup() {
}

function openNumberPopup(){
}

//FILTERS 
function checkFilter(event) {
    //filter = event.target.dataset.filter;
    houseSelected = houseFilter.selectedIndex;

    const filteredStudents = filterStudents();
    displayTable(filteredStudents);
}

function filterStudents() {
    //console.log(optionSelected);
    let filteredStudents = [];
    switch(houseSelected) {
        case 1:
            filteredStudents = globalStudents.filter(isAll);
            break;
        case 2:
            filteredStudents = globalStudents.filter(isGryffindor);
            break;
        case 3:
            filteredStudents = globalStudents.filter(isRavenclaw);
            break;
        case 4:
            filteredStudents = globalStudents.filter(isHufflepuff);
            break;
        case 5:
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
    if(student.house === "hufflepuff" || student.house === "Hufflepuff"){
        return true;
    }
    else{
        return false;
    }
}

function isGryffindor(student){
    if(student.house === "gryffindor" || student.house === "Gryffindor"){
        return true;
    }
    else{
        return false;
    }
}

function isSlytherin(student){
    if(student.house === "slytherin" || student.house === "Slytherin"){
        return true;
    }
    else{
        return false;
    }
}

function isRavenclaw(student){
    if(student.house === "ravenclaw" || student.house === "Ravenclaw"){
        return true;
    }
    else{
        return false;
    }
}

function isAll(student){
    return true;

}

//HOUSE COLOURS AND CREST 
function getHouse(student){
}

function displayCrestAndColours(house){
}

//SORTING 
function checkSort(event) {
    sort = event.target.dataset.sort;
    console.log(sort);

    const sortedStudents = sortStudents();
    displayTable(sortedStudents);
}

function sortStudents(){

    let  sortedStudents = [];
    switch(sort){
        case "first-name":
            sortedStudents = globalStudents.sort(sortByFirstName);
            break;
        case "middle-name":
            sortedStudents = globalStudents;
            break;
        case "last-name":
            sortedStudents = globalStudents.sort(sortByLastName);
            break;
        case "nickname":
            sortedStudents = globalStudents;
            break;

        case "house":
            sortedStudents = globalStudents;
            break;
    }


    return sortedStudents;


    return sortedStudents;
}


function sortByFirstName(a , b) {
        if(a.firstName < b.firstName) {
            return -1;
            }
            else {
                return 1;
            }
}

function sortByLastName(a, b){
    if(a.lastName < b.lastName) {
        return -1;
        }
        else {
            return 1;
        }
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

function toggleExpell(){
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


