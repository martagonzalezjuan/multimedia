function createSearchButtons(aleatorioFunction, masCercanoFunction) {
    // Boton aleatorio
    const buttonAleatorio = document.createElement('button');
    buttonAleatorio.textContent = 'Aleatorio';
    buttonAleatorio.classList.add('search-button');

    // Boton cercano
    const buttonMasCerca = document.createElement('button');
    buttonMasCerca.textContent = 'Más cerca';
    buttonMasCerca.classList.add('search-button');


    buttonMasCerca.addEventListener('click', () => {
        masCercanoFunction();
    });

    button.addEventListener('click', () => {
        aleatorioFunction();
    });

    return buttonAleatorio;
}