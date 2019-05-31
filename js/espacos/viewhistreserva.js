let ViewHistReserva = function (espaco, cell) {

    let that = this, form, grid, layout, gridconvidados, tab;

    this.MontaFormulario = function (espacoid) {

        layout = cell.attachLayout({
            pattern: '2U',
            offsets: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            cells: [
                {
                    id: 'a',
                    width:280,
                    header: false
                },
                {
                    id: 'b',
                    header: false,
                }
            ]
        });

        let lcenter = layout.cells('b').attachLayout({
            pattern: '2E',
            offsets: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            cells: [
                {
                    id: 'a',
                    height: 50,
                    header: false
                },
                {
                    id: 'b',
                    header: false,
                }
            ]
        });

        form = lcenter.cells('a').attachForm();
        form.loadStruct([
            {type: 'settings', offsetLeft:10, offsetTop:15, inputWidth:150, labelWidth:140, labelAlign: 'right'},
            {type: 'input', name: 'start_date', label: 'Horário de Início:'},
            {type:"newcolumn"},
            {type: 'input', name: 'end_date', label: 'Horário de finalização:'},
            {type:"newcolumn"},
            {type: 'input', name: 'bloco', label: 'Bloco:'},
            {type:"newcolumn"},
            {type: 'input', name: 'unidade', label: 'Unidade:'}
        ], function () {

        });


        tab = lcenter.cells('b').attachTabbar({
            mode: 'top',
            align: 'left',
            tabs: [
                {
                    id: 'convidados',
                    text: 'Convidados',
                    active: true
                },
                {
                    id: 'checklist',
                    text: 'Checklist'
                }
            ]
        });

        gridconvidados = tab.cells('convidados').attachGrid();
        gridconvidados.setHeader(['id','Nome','RG']);
        gridconvidados.setColTypes('ro,ed,ed');
        gridconvidados.setColSorting('str,str,str');
        gridconvidados.enableSmartRendering(true);
        gridconvidados.enableMultiselect(true);
        gridconvidados.init();

    };

    this.CarregaLista = function (lista) {

        grid = layout.cells('a').attachGrid();
        grid.setHeader(['Código','Data','Bloco', 'Unidade']);
        grid.attachHeader(',#text_filter,#text_filter,#text_filter');
        grid.setColTypes('ro,ro,ro,ro');
        grid.setColSorting('str,str,str,str');
        grid.setInitWidths("0,110,");
        grid.enableSmartRendering(true);
        grid.enableMultiselect(true);
        grid.init();

        grid.attachEvent("onRowSelect", function (id) {
            cell.progressOn();
            espaco.Reservas.Info(id, function (infoitem) {

                cell.progressOff();

                if (infoitem === null)
                    return;

                let dados = infoitem[0];
                form.setFormData(dados);

                new AgendaConvidados(dados.id).Listar(function (convidados) {

                    if (convidados === null)
                        return;

                    gridconvidados.parse(convidados, 'json');
                });

            })
        });

        console.debug(lista);
        if (lista !== null)
            grid.parse(lista, 'json');
    };

    this.CarregaInformacoes = function (info) {
        form.setFormData(info);
    };

    this.LimparFormulario = function() {

        form.clear();
        form.setFormData({});
        form.setItemValue('id', null);

    };

    function AoExecutarOperacao() {
        cell.progressOff();
        document.dispatchEvent(new CustomEvent('AoExecutarOperacaoCadastro', {
            detail: null
        }));
    }


};