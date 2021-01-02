const tabButtons  = document.querySelectorAll('.tabLink');
tabButtons.forEach(btn =>{
    btn.addEventListener('click', (e)=>{
      const landLordContent = document.getElementById('landLordContent');
      const tenantContent = document.getElementById('tenantContent');
      const forTenant = document.querySelector('#forTenant');
      const forLandLord = document.querySelector('#forLandLord');

        if(e.target.getAttribute('id') === "forTenant"){
            console.log("This are cards");
         
            if(tenantContent.classList.contains('active')){
                console.log("ALREADY IS ACTIVE")
                return
            }

            if(landLordContent.classList.contains('active')){
                landLordContent.classList.remove('active');
            }
            tenantContent.classList.add('active');

            if(forTenant.classList.contains('active')){
                return
            }else{
                forLandLord.classList.remove("active")
                forTenant.classList.add('active')
            }

        }else if(e.target.getAttribute('id') === "forLandLord"){
            console.log('This are maps');
            if(landLordContent.classList.contains("active")){
                console.log("Already on maps")
                return
            }

            if(tenantContent.classList.contains('active')){
                tenantContent.classList.remove('active');
                console.log('removed', tenantContent)
            }
            landLordContent.classList.add('active');

            if(forLandLord.classList.contains('active')){
                return
            }else{
                forTenant.classList.remove("active")
                forLandLord.classList.add('active')
            }            
        }
    })
})