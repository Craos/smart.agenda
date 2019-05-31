let ViewEspaco = function () {

    let espaco = new Espaco(), espacoid, toolbar, listadeespacos;

    this.MontaLayout = function (container) {

        container.detachToolbar();
        container.detachObject(true);
        container.hideHeader();

        toolbar = container.attachToolbar({
            onClick: function (id) {
                espacoid = id;

                 listadeespacos.filter(function (item) {
                    return item.id === id;
                });

                console.debug(listadeespacos)

                toolbar.setItemText('info', nomespaco);
                container.progressOn();
                espaco.Info(id, function (espacoinfo) {

                    if (espacoinfo === null) {
                        container.progressOff();
                        return;
                    }

                    cadastro.CarregaInformacoes(espacoinfo[0]);
                    container.progressOff();
                });
            }
        });

        toolbar.loadStruct([
            {type: "buttonSelect", id: "espaco", text: "Selecione o espaço"},
            {id: "sep1", type: "separator" },
            {id: "info", type: "text"}
        ], ListaEspacos);

        let tab = container.attachTabbar({
            mode: 'top',
            align: 'left',
            tabs: [
                {
                    id: 'cadastro',
                    text: 'Geral',
                    active: true
                },
                {
                    id: 'itens',
                    text: 'Itens'
                },
                {
                    id: 'documentos',
                    text: 'Documentos'
                },
                {
                    id: 'reservas',
                    text: 'Reservas'
                }
            ]

        });

        let cadastro = new ViewEspacoCadastro(espaco, tab.cells('cadastro'));
        cadastro.MontaFormulario();

        let itens = new ViewEspacoitens(espaco, tab.cells('itens'));
        let hist = new ViewHistReserva(espaco, tab.cells('reservas'));

        tab.attachEvent("onSelect", function (id) {

            switch (id) {
                case 'itens':
                    espaco.Itens.Listar(function (listaitens) {
                        itens.MontaFormulario(espacoid);
                        itens.CarregaLista(listaitens);
                        container.progressOff();
                    });
                    break;
                case 'documentos':
                    break;
                case 'reservas':
                    espaco.Reservas.Listar(function (listareservas) {
                        hist.MontaFormulario(espacoid);
                        hist.CarregaLista(listareservas);
                        container.progressOff();
                    });
                    break;

            }
            return true;
        });

        document.addEventListener('AoExecutarOperacaoCadastro', function () {
            espaco.Listar(function (listaespacos) {
                list.clearAll();
                list.parse(listaespacos, 'json');
            });
        });

    };

    function ListaEspacos() {
        espaco.Listar(function (listaespacos) {
            listadeespacos = listaespacos;
            listaespacos.filter(function (item) {
                toolbar.addListOption('espaco', item.id, 1, 'button', item.localizacao + ' ' + item.nome);
            });
        });
    }
};