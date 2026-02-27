const submitbtn=document.getElementById('submit_btn')

submitbtn.addEventListener('click',()=>{
    console.log('Submitting Exam')
    //this 'proctorAPI' comes from preload.js
    if (window.proctorAPI){
        window.proctorAPI.submitExam()
        console.log('Exam Submitted via API')
    } else {
        console.log('Proctor API not available,running in Electron?')
    }
})



