var	addToCartModal = document.querySelector('.add-to-cart-modal');
var jsAddToCartModal = document.querySelectorAll('.js-add-to-cart-modal');
var arrayJsAddToCartModal = Array.prototype.slice.call(jsAddToCartModal);
var modalOverlay = document.querySelector('.modal-overlay');

arrayJsAddToCartModal.forEach(function(entry) {
	entry.addEventListener('click', function(evt) {
		evt.preventDefault();
		modalOverlay.classList.add('modal-overlay--opened');
		addToCartModal.classList.add('add-to-cart-modal--opened');
		if (modalOverlay.classList.contains('modal-overlay--opened')) {
			modalOverlay.addEventListener('click', function(evt) {
				if (evt.target === modalOverlay) {
					modalOverlay.classList.remove('modal-overlay--opened');
					addToCartModal.classList.remove('add-to-cart-modal--opened');
				}
			});
			window.addEventListener('keydown', function(evt) {
				if (evt.keyCode === 27) {
					evt.preventDefault();
					modalOverlay.classList.remove('modal-overlay--opened');
					addToCartModal.classList.remove('add-to-cart-modal--opened');
				}
			});
		}
	});
});
