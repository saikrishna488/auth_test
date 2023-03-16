(function () {
	'use strict'

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.querySelectorAll('.needs-validation')

	// Loop over them and prevent submission
	Array.prototype.slice.call(forms)
		.forEach(function (form) {
			form.addEventListener('submit', function (event) {
				if (!form.checkValidity()) {
					event.preventDefault()
					event.stopPropagation()
				}

				form.classList.add('was-validated')
			}, false)
		})
}())

if(document.getElementsByClassName('btn')[0]){
    document.getElementsByClassName('btn')[0].onclick = ()=>{
        location.href = "/user/register"
    }
}

if(document.getElementsByClassName('logout')[0]){
    document.getElementsByClassName('logout')[0].onclick = ()=>{
        location.href = "/user/logout"
    }
}