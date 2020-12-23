
const tabLinks = document.querySelectorAll('.tabLink');
const tabContents = document.querySelectorAll(".tabContent");
const forLanLord = document.querySelector('#forLandLord')
const forTenant = document.querySelector("#forTenant")
console.log("This are tabLoinks", tabLinks)
tabLinks.forEach(link =>{
  link.addEventListener('click', (e)=>{
    const linkId = e.target.getAttribute('id');
  
    for(let  i=0; i < tabContents.length; i++){
      if(tabContents[i].getAttribute('id') === linkId){
        tabContents[i].classList.add('active')
      }else{
        tabContents[i].classList.remove('active');
      }
    }
  })
})