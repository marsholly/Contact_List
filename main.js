'use strict'

$(() => {
  $('#addNewContact').submit(addNewOne);
  let contactLists = contactFromStorage();
  let $lis = contactLists.map(obj => createList(obj));
  $('#list').append($lis);
  $('#list').on('click', '#delete', removeContact);
  $('#list').on('click', '#edit', openEditModal);
  $('#editContact').submit(updateContact);
  $('#searchForm').submit(searchByName);
  $('#sort').on('click', sortByName);
});

function sortByName(){
  let contactLists = contactFromStorage();
  contactLists.map(contact => {
    
    console.log('contact:', contact.name);
  })
  // let name = contactLists.name;
}

function searchByName(event){
  event.preventDefault();
  let $searchName = $('#searchText');
  let name = $searchName.val();

  let json = localStorage.contactLists;
  let contactLists = JSON.parse(json);
  let nameList = [];
  let index;
  contactLists.map( (contact, i) => {
    if(contact.name !== name){
      nameList.push(contact.name);
    }
  });

  nameList.map(name =>{
    let $li = $('.'+ name);
    $li.addClass('hidden');
  });

}

function updateContact(event){
  event.preventDefault();
  let index = $('#editContactModal').data('index');

  let newName = $('#editName').val();
  let newPhone = $('#editPhoneNumber').val();
  let newAddress = $('#editAddress').val();
  let newEmail = $('#editEmail').val();
  let newPhoto = $('#editPhoto_url').val();

  let json = localStorage.contactLists;
  let contactLists = JSON.parse(json);
  let contactList = contactLists[index];
  contactList["name"] = newName;
  contactList["phone"] = newPhone;
  contactList["address"] = newAddress;
  contactList["email"] = newEmail;
  contactList["photo"] = newPhoto;

  saveContactList(contactList, index);
  $('#editContactModal').modal('hide');
}

function saveContactList(obj, index) {
  let json = localStorage.contactLists;
  let contactLists = JSON.parse(json);
  contactLists[index] = obj;
  localStorage.contactLists = JSON.stringify(contactLists);
  location.reload();
}

function openEditModal() {
  let $li = $(this).closest('li');
  let index = $li.index();

  let name = $(this).parent().siblings('h3').text();
  let phone = $(this).parent().siblings('h6#p').children().text();
  let address = $(this).parent().siblings('h6#a').children().text();
  let email = $(this).parent().siblings('h6#e').children().text();
  let photo = $(this).parent().parent().siblings('img').attr('src');

  $('#editName').val(name);
  $('#editPhoneNumber').val(phone);
  $('#editAddress').val(address);
  $('#editEmail').val(email);
  $('#editPhoto_url').val(photo);

  $('#editContactModal').data('index', index);
}

function removeContact(){
  let $li = $(this).closest('li');
  let index = $li.index();
  removeFromStorage(index);
  $li.remove();
}

function removeFromStorage(index) {
  let contactLists = contactFromStorage();
  contactLists.splice(index, 1);
  writeToStorage(contactLists);
}

function addNewOne(event) {
  event.preventDefault();
  let $name = $('#name');
  let $phone = $('#phoneNumber')
  let $newAddress = $('#newAddress');
  let $email = $('#email');
  let $photo = $('#photo_url');

  let newContact = {
    name: $name.val(),
    phone: $phone.val(),
    address: $newAddress.val(),
    email: $email.val(),
    photo: $photo.val()
  };

  let $li = createList(newContact);
  $('#list').append($li);
  addToStorage(newContact);

  $name.val('');
  $phone.val('');
  $newAddress.val('');
  $email.val('');
  $photo.val('');

  $('#newContactModal').modal('hide');
}

function createList(obj) {
  let $li = $('#template').clone();
  $li.removeClass('hidden');

  $li.find('.newContactPhoto').attr('src', obj["photo"]);
  $li.find('.newContactName').text(obj["name"]);
  $li.find('.newContactPhone').text(obj["phone"]);
  $li.find('.newContactAddress').text(obj["address"]);
  $li.find('.newContactEmail').text(obj["email"]);

  $li.removeAttr('id');
  $li.addClass(obj["name"]);
  return $li;
}

function addToStorage(obj) {
  let contactLists = contactFromStorage();
  contactLists.push(obj);
  writeToStorage(contactLists);
}

function contactFromStorage() {
  let json = localStorage.contactLists;
  let contactLists;
  try {
    contactLists = JSON.parse(json);
  }catch(e) {
    contactLists = [];
  }
  return contactLists;
}

function writeToStorage(arr) {
  localStorage.contactLists = JSON.stringify(arr);
}
