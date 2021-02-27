"use strict";

window.addEventListener("DOMContentLoaded", start);

// Results from fetch
let studentsGlobalArray = [];
let families = {};

// Cleaned version
let globalStudents = [];
let globalFilteredStudents = [];


//OBJECT FOR FILTERING AND SORTING 
let settings = {
    filterBy: "All",
    sortBy: "all",
    sortDir: "",
    searchQuery: ""
}

let isHacking = false;

//variables for filtering
const houseButton = document.getElementById("housefilter");

// Search Input
const searchInput = document.getElementById("searchbar");

//variables for sorting
const listItems = document.querySelectorAll("[data-action=sort]");

//variables for pop-up 
const numbersButton = document.getElementById("more-details");

let studentTemplate = {
    fullname: "",
    gender: "",
    house: "",
}

function start() {
    loadJSON();

    //Add event listeners for filters and sorts
    houseButton.addEventListener("change", checkFilter);

    searchInput.addEventListener("keyup", checkSearch);

    listItems.forEach((listItem) => {
        listItem.addEventListener("click", checkSort);
    });

    //Event listeners for numbers pop-up
    numbersButton.addEventListener("click", openNumberDialog);

    //Add event listeners for filters, etc
}

async function loadJSON() {
    const studentsResponse = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
    const studentsJsonData = await studentsResponse.json();

    const familiesResponse = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
    const familiesJsonData = await familiesResponse.json();

    families = familiesJsonData;

    //when loaded, prepare data 
    prepareObjects(studentsJsonData);
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
    document.getElementById("current-no").innerHTML =`There's currently ${students.length} students showing`;
    //create new list for each student
    students.forEach(displayStudent);
}

function displayStudent(student) {
    //create clone 
    const copy = document.querySelector("template#student").content.cloneNode(true);
    //fill template 
    copy.querySelector("[data-field=firstName]").textContent = `${student.firstName} >` ; 
    copy.querySelector("[data-field=middleName]").textContent = student.middleName;
    copy.querySelector("[data-field=lastName]").textContent = student.lastName;
    copy.querySelector("[data-field=nickName]").textContent = student.nickName; 
    copy.querySelector("[data-field=bloodStatus]").textContent = student.bloodStatus; 
    copy.querySelector("[data-field=house]").textContent = student.house;
    copy.querySelector("[data-field=squad-member]").textContent = student.squadMember;

    //EXPELL STUDENT TOGGLE 
    if (student.expelled == true) {
    copy.querySelector("[data-field=expelled]").textContent = "✔"; 
    } else {
    copy.querySelector("[data-field=expelled]").textContent = "expell"; 
    }

    copy.querySelector("[data-field=expelled]").addEventListener("click", function () {
        expellStudent(student);
    });

    copy.querySelector("[data-field=squad-member]").addEventListener("click", function () {
        assignToSquad(student);
    });

    //MAKE PREFECT TOGGLE
    copy.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;


    copy.querySelector("[data-field=prefect]").addEventListener("click", function() {
        clickPrefect(student);
    });

    //OPEN STUDENT DIALOG 
    //add eventlistener to open dialog 
    copy.querySelector("[data-field=firstName]").addEventListener("click", clickStudent);
    //grab selectedStudent and send student info to display dialog 
    function clickStudent(){
    openStudentPopup(student);
    }
    //append clone 
    document.querySelector("#list tbody").appendChild(copy);
}

function assignToSquad(student) {
    // OPTIONAL: Add check for it person is expelled (don't allow to set to yes)

    if (student.house === 'Slytherin' || student.bloodStatus === 'Pure') {
        // student.squadMember = student.squadMember === 'Yes' ? 'No' : 'Yes'
        if (student.squadMember === 'Yes') {
            student.squadMember = 'No';
        } else {
            student.squadMember = 'Yes';
        }

        buildList();
    } else {
        // show popup that explains you're not worthy
    }

    if (isHacking) {
        console.log('i am hacking');
        setTimeout(function() {
            student.squadMember = 'No';

            // You can change to something else
            alert('Something fishy is going on...');
            buildList();
        }, 5000);
    }
}

function clickPrefect(student){
    // OPTIONAL: Add check for it person is expelled (don't allow to set to yes)

    if (student.prefect === true){
        student.prefect = false;
    } else{
        tryToMakePrefect(student);
    }
    buildList();
}

function expellStudent(student){
    if (student.expelled === true){
        return;
    } else {
        tryToExpell(student);
        buildList();
    }

    // student.expelled =! student.expelled;
}


function openStudentPopup(selectedStudent) {
    //show student popup 
    document.getElementById("student-dialog").classList.remove("hide");
    //change student info 
    // Set image 
    document.querySelector(".student-img").src = `images/${selectedStudent.imageUrl}`;

    // Set info
    document.querySelector("#fullname").innerHTML = `${selectedStudent.firstName} ${selectedStudent.lastName}`;
    document.querySelector("#prefect").innerHTML = `${selectedStudent.prefect}`;
    document.querySelector("#expelled").innerHTML = `${selectedStudent.expelled}`;
    document.querySelector("#squadmember").innerHTML = `${selectedStudent.squadMember}`;
    document.querySelector("#bloodstatus").innerHTML = `${selectedStudent.bloodStatus}`;

    //set student colours and crest
    document.querySelector(".crest").src = `icons/${selectedStudent.house}.svg`;

    // Move styling to css, control styling with javascript by toggling classNames
    if(selectedStudent.house == "Slytherin"){
        document.querySelector(".house-border").style.borderColor = "rgb(37, 117, 0)";
        document.querySelector(".crest").style.borderColor = "rgb(37, 117, 0)";
    } else if(selectedStudent.house == "Gryffindor"){
        document.querySelector(".house-border").style.borderColor = "rgb(117, 0, 0)";
        document.querySelector(".crest").style.borderColor = "rgb(117, 0, 0)";
    } else if(selectedStudent.house == "Ravenclaw"){
        document.querySelector(".house-border").style.borderColor = "rgb(0, 80, 117)";
        document.querySelector(".crest").style.borderColor = "rgb(0, 80, 117)";
    } else if(selectedStudent.house == "Hufflepuff"){
        document.querySelector(".house-border").style.borderColor = "rgb(209, 195, 0)";
        document.querySelector(".crest").style.borderColor = "rgb(209, 195, 0)";
    }

    // close window on click
    document.querySelector("#student-dialog .closebutton").addEventListener("click", closeStudentPopup);

    function closeStudentPopup(){
        document.getElementById("student-dialog").classList.add("hide");
        document.querySelector("#student-dialog .closebutton").removeEventListener("click", closeStudentPopup);
    }

}


function tryToExpell(selectedStudent){
    document.querySelector("#expell-dialog").classList.remove("hide");

    if (selectedStudent.nickName === 'JOJO') {
        document.querySelector("#expell-dialog .generic").classList.add("hide");
        document.querySelector("#expell-dialog .awesome-student").classList.remove("hide");
    } else {
        document.querySelector("#expell-dialog .generic").classList.remove("hide");
        document.querySelector("#expell-dialog .awesome-student").classList.add("hide");
    }

    document.querySelector("#expellstudent").addEventListener("click", clickExpellStudent);
    document.querySelector("#expell-dialog .closebutton").addEventListener("click", closeExpellDialog);

    function clickExpellStudent() {
        selectedStudent.expelled = true;
        const onlyNonExpelled = globalStudents.filter(student => student.expelled === false);
        closeExpellDialog();
        displayData(onlyNonExpelled);
    }

    // OPTIONAL: Remove prefect status and squad member status (no expelled students can be prefects or squad members)

    function closeExpellDialog(){
        console.log("closebutton clicked");
        document.querySelector("#expell-dialog").classList.add("hide");
    }
}

function tryToMakePrefect(selectedStudent){

    const prefects = globalStudents.filter(student => student.prefect);
    const numberOfPrefects = prefects.length;
    const other = prefects.filter(student => student.gender === selectedStudent.gender).shift();

    //if there is another of the same type 
    if(other !== undefined) {
        removeOther(other);
    } 
    else {
        makePrefect(selectedStudent);
    }

    function removeOther(other){
    //ask user to ignore or remove the other 
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other #removeother").innerHTML = `remove ${other.firstName} as prefect`;
    document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

    //if ignore - do nothing 
    function closeDialog(){
    document.querySelector("#remove_other").classList.add("hide");
    document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
    }
    //if remove other 
    function clickRemoveOther(){
    removePrefect(other);
    makePrefect(selectedStudent);
    buildList();
    closeDialog();
    }
    }

function removePrefect(prefectStudent){
    prefectStudent.prefect = false;
}

function makePrefect(student){
    console.log("making student prefect")
    student.prefect = true;
}

}

function cleanStudents(students){
    console.log(students);

    students.forEach(student => {
        const cleanedStudentObject = getItems(student);
        globalStudents.push(cleanedStudentObject);
    });

    console.table(globalStudents);
}

function getBloodStatus(lastName) {
    const hyphenIndex = lastName.indexOf('-');

    if (hyphenIndex > -1) {
        // Split names into two names (easier to handle)
        const hyphenName = lastName.split('-');

        const isPure = hyphenName.some(function(name) {
            return families.pure.includes(name)
        });

        const isHalf = hyphenName.some(function(name) {
            return families.half.includes(name)
        });

        if (isPure && isHalf) {
            return 'Half'
        } 

        if (isPure) {
            return 'Pure';
        }

        if (isHalf) {
            return 'Half';
        }

        return 'Muggle';
    } 

    if (families.half.includes(lastName)) {
        return 'Half';
    } 
    
    if (families.pure.includes(lastName)) {
        return 'Pure' ;
    }

    return 'Muggle';
}


function getItems(student){
    const nameObject = splitNames(student.fullname);
    //const studentHouse = student.house;

    const bloodStatus = getBloodStatus(nameObject.lastName);

    const studentHouse = cleanItem(student.house);
    const studentGender = student.gender;
    const imageURL = `${nameObject.lastName.toLowerCase()}_${nameObject.firstName.charAt(0).toLowerCase()}.png`;

    return {
        firstName: nameObject.firstName,
        lastName: nameObject.lastName,
        middleName: nameObject.middleName,
        nickName: nameObject.nickName,
        house: studentHouse,
        imageUrl: imageURL,
        gender: studentGender,
        expelled: false,
        prefect: false,
        bloodStatus: bloodStatus,
        squadMember: 'No',
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
            nameObject.firstName = cleanItem(name);   
        }

        // If index is not 0 or names.length - 1 (last index) (last name or first name)
        if (index !== 0 && index !== names.length - 1) {

            
            // If this is a nickname (starts and ends with ")
            if (name[0] == '"' && name[name.length - 1] == '"' ) {
                nameObject.nickName = cleanItem(name);
            } else {
                nameObject.middleName = cleanItem(name);   
            }
        }

        if (index === names.length - 1) {
            nameObject.lastName = cleanItem(name);   
        }
    })

    return nameObject;
}

function cleanItem(item){
    let itemWithoutQuotationMarks = item.replaceAll('"', '');
    const hyphenIndex = itemWithoutQuotationMarks.indexOf('-');

    if (hyphenIndex > -1) {
        // Split names into two names (easier to handle)
        const hypenNames = itemWithoutQuotationMarks.split('-');


        // Combine names + add uppercase to the latter name in the hyphen
        itemWithoutQuotationMarks = `${hypenNames[0]}-${hypenNames[1].charAt(0).toUpperCase()}${hypenNames[1].slice(1)}`
        return itemWithoutQuotationMarks;
    } 

    itemWithoutQuotationMarks = itemWithoutQuotationMarks.trim();
    return `${itemWithoutQuotationMarks.charAt(0).toUpperCase()}${itemWithoutQuotationMarks.slice(1).toLowerCase()}`;
}

function displayData(students){
    displayTable(students);
}

//POPUPS
function openNumberDialog(){
    //show number dialog 
    document.getElementById("number-dialog").classList.remove("hide");
    document.querySelector("#number-dialog .closebutton").addEventListener("click", closeNumbers);

    //Set content of dialog
    let expelledStudents = globalStudents.filter(student => student.expelled);
    document.getElementById("expelled-number").innerHTML = `Expelled students: ${expelledStudents.length}`;

    let totalStudents = globalStudents.length;
    document.getElementById("total-number").innerHTML = `Total students: ${totalStudents}`;

    let gryffindorStudents = globalStudents.filter(student => student.house === "Gryffindor");
    document.getElementById("gryffindor-number").innerHTML = `Gryffindor students: ${gryffindorStudents.length}`;

    let slytherinStudents = globalStudents.filter(student => student.house === "Slytherin");
    document.getElementById("slytherin-number").innerHTML = `Slytherin students: ${slytherinStudents.length}`;

    let hufflepuffStudents = globalStudents.filter(student => student.house === "Hufflepuff");
    document.getElementById("hufflepuff-number").innerHTML = `Hufflepuff students: ${hufflepuffStudents.length}`;

    let ravenclawStudents = globalStudents.filter(student => student.house === "Ravenclaw");
    document.getElementById("ravenclaw-number").innerHTML = `Ravenclaw students: ${ravenclawStudents.length}`;


    //close numbers dialog
    function closeNumbers(){
        document.getElementById("number-dialog").classList.add("hide");
        document.querySelector("#number-dialog .closebutton").removeEventListener("click", closeNumbers);
    }
}

//FILTERS EXPELLED

//FILTERS HOUSE 
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

// FILTERS BY SEARCH
function checkSearch() {
    settings.searchQuery = searchInput.value;
    buildList();
}

function filterStudentsBySearch(students) {
    return students.filter(function(student) {
        return (
            student.firstName.toLowerCase().includes(settings.searchQuery.toLowerCase()) || 
            student.lastName.toLowerCase().includes(settings.searchQuery.toLowerCase())
        );
    });
}

function filterStudentsBySelect(filteredStudents) {
    switch(settings.filterBy) {
        case "All":
            filteredStudents = globalStudents.filter(isAll);
            break;
        case "Gryffindor":
        case "Ravenclaw":
        case "Hufflepuff":
        case "Slytherin":
            filteredStudents = globalStudents.filter(function(student) {
                return checkHouse(student, settings.filterBy);
            });
            break;
        case "Expelled":
            filteredStudents = globalStudents.filter(isExpelled);
    }

    return filteredStudents;
}

function isExpelled(student) {    
    if (student.expelled === true) {
        return true;
    } else { 
        return false;
    }
}

function checkHouse(student, house){
    if(student.house === house){
        return true;
    } else{
        return false;
    }
}

function isAll(student){
    if (student.expelled) { 
        return false;
    }

    return true;
}

//SORTING 
function checkSort(event) {
    const sortBy = event.target.dataset.sort;
    let sortDir = event.target.dataset.sortDirection

    //toggle direction 
    if (settings.sortDir === "asc"){
        sortDir = "desc";
    } else {
        sortDir = "asc";
    }

    setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
}

function sortStudents(sortedList){

    let direction = 1;
    if (settings.sortDir === "desc") {
        direction = -1
    } else {
        direction = 1;
    }

    sortedList = sortedList.sort(sortBySort);

    function sortBySort(studentA, studentB) {
        if(studentA[settings.sortBy] < studentB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }
    return sortedList;
}

//BUILD LIST 
function buildList() {
    globalFilteredStudents = filterStudentsBySelect(globalStudents);
    globalFilteredStudents = filterStudentsBySearch(globalFilteredStudents);
    globalFilteredStudents = sortStudents(globalFilteredStudents);
    displayTable(globalFilteredStudents);
} 

// RANDOMIZE BLOOD STATUS
function randomizeBloodStatus () {
    if (isHacking) {
        globalStudents = globalStudents.map(function(student) {
            const bloodStatusTypes = ['Pure', 'Half'];
            student.bloodStatus = bloodStatusTypes[Math.floor(Math.random() * 2)];
            return student;
        }) 
    }
}

//HACKING HACK HACK
function hackTheSytem() {
    // Returns (does nothing, if is hacking is true)
    if (isHacking) return;

    isHacking = true;
    console.log('%c Oh my heavens! the dark powers are taking over, help!!', 'color: #FF0000; font-size: 2rem');

    const hackerGirl = {
        firstName: 'Johanna',
        lastName: 'Himstedt',
        middleName: 'N/A',
        nickName: 'JOJO',
        house: 'None of your beezneez',
        imageUrl: 'imageURL',
        gender: 'girl',
        expelled: false,
        prefect: false,
        bloodStatus: 'Muggle',
        squadMember: 'Fuck yeah',
    }

    globalStudents.push(hackerGirl);
    randomizeBloodStatus();
    buildList();
}
