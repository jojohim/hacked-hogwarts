"use strict";

window.addEventListener("DOMContentLoaded", start);

let studentsGlobalArray = [];
let globalStudents = [];
let filter;

let studentTemplate = {
    fullname:"",
    gender:"",
    house: "",
}

function start() {
    loadJSON();

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
    copy.querySelector("[data-field=firstname]").textContent = student.firstName;
    copy.querySelector("[data-field=middlename]").textContent = student.middleName;
    copy.querySelector("[data-field=lastname]").textContent = student.lastName;
    copy.querySelector("[data-field=nickname]").textContent = student.nickName;
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
}

function isExpelled(student) {    
}

function isNotExpelled(student) {    
}

function isHufflepuff(student){
}

function isGryffindor(student){
}

function isSlytherin(student){
}

function isRavenclaw(student){
}

function isAll(student){
}

//HOUSE COLOURS AND CREST 
function getHouse(student){
}

function displayCrestAndColours(house){
}

//SORTING 

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


