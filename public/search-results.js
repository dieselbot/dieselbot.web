const map_embed = document.querySelector('iframe.embed');

document.querySelectorAll('.fuel-stop').forEach(fuel_stop => {
    fuel_stop.addEventListener('click', () => {

        if (fuel_stop.classList.contains('selected')) return;

        document.querySelector('.fuel-stop.selected').classList.remove('selected');

        map_embed.contentWindow.location.replace(
            ['https://www.google.com/maps/embed/v1/place',
             '?key=AIzaSyDoD9xMipsgP9IeW130_XSz5MWLDIIC0kQ',
             `&q=place_id:${fuel_stop.dataset.placeId}`].join('')
        );

        fuel_stop.classList.add('selected');
    })
});