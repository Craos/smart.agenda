let webservice = new Webservice();
dhtmlxEvent(window, 'load', function () {

    if (!sessionStorage.auth) {

        sessionStorage.credentials = JSON.stringify({
            id: '$2a$06$AFSMmoY2qaCqvZkT8esZGuqcXK3uFHPOtUiQJPq7ZpnYgPomRBaba',
            name: 'smart.agenda',
            title: 'Smart Agenda',
            redirect: '../smart.agenda',
            version: '1.0'
        });

        window.location = '../smart.auth';
        return;
    }

    let gmi = new GMI();
    gmi.MontaLayout();

});

let GMI = function () {

    let that = this, siderbar;

    this.MontaLayout = function () {

        siderbar = new dhtmlXSideBar({
            parent: document.body,
            template: 'icons_text',
            icons_path: 'img/siderbar/',
            single_cell: false,
            width: 80,
            header: true,
            autohide: false,
            items: [
                {
                    id: 'gestor',
                    text: 'Dashboard',
                    icon: 'gestor.png',
                    selected: false
                },
                {
                    id: 'agenda',
                    text: 'Agenda',
                    icon: 'agenda.png',
                    selected: false
                },
                {
                    id: 'espacos',
                    text: 'Espaços',
                    icon: 'espacos.png',
                    selected: true
                }
            ]

        });

        siderbar.attachEvent('onSelect', function (id) {
            that.SelecionarOpcao(id);
        });

        //that.SelecionarAgenda();
        that.SelecionarEspacos();
    };

    this.SelecionarOpcao = function (id) {
        switch (id) {
            case 'gestor':
                that.SelecionarGestor();
                break;
            case 'agenda':
                that.SelecionarAgenda();
                break;
            case 'espacos':
                that.SelecionarEspacos();
                break;
        }
    };

    this.SelecionarGestor = function () {

        siderbar.cells('gestor').progressOn();
        webservice.Request({
            process: 'gmi.gestor',
            params: JSON.stringify({})
        }, function (http) {

            if (http.response === 'null' || http.response === 'false') {
                return;
            }

            let gestor = new Gestor(JSON.parse(JSON.parse(http.response)[0].gestor)[0]);
            gestor.MontaLayout(siderbar.cells('gestor'), function () {
                siderbar.cells('gestor').progressOff();
            });


        });

    };

    this.SelecionarAgenda = function () {
        new ViewReserva().MontaLayout(siderbar.cells('agenda'));
    };

    this.SelecionarEspacos = function () {
        new ViewEspaco().MontaLayout(siderbar.cells('espacos'));
    };

};