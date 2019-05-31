let ViewEspacoitens = function (espaco, cell) {

    let that = this, form, grid, layout;

    this.MontaFormulario = function (espacoid) {

        cell.detachToolbar();

        cell.attachToolbar({
            icon_path: "./img/toolbar/cadastro/",
            items: [
                {id: "novo", text: "Novo", type: "button", img: "novo.png"},
                {id: "salvar", text: "Salvar", type: "button", img: "salvar.png"},
                {id: "remover", text: "Remover", type: "button", img: "remover.png"},
            ],
            onClick: function (id) {
                switch (id) {
                    case 'novo':
                        that.LimparFormulario();
                        break;
                    case 'salvar':
                        form.validate();
                        break;
                    case 'remover':
                        espaco.Itens.Remover(form.getItemValue('id'), AoExecutarOperacao);
                        break;
                }
            }
        });

        layout = cell.attachLayout({
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
                    header: false
                },
                {
                    id: 'b',
                    header: false,
                }
            ]
        });

        layout.cells('a').detachObject(true);
        form = layout.cells('a').attachForm();
        form.loadStruct([
            {type: 'settings', offsetLeft:10, offsetTop:15, inputWidth:200, labelWidth:140, labelAlign: 'right'},
            {type: 'input', name: 'nome', required: true, label: 'Nome do item:'},
            {type: 'input', name: 'quantidade', required: true, label: 'Quantidade:'},
            {type: 'input', name: 'observacoes', label: 'Observações:'},
            {type: 'input', name: 'inventario', label: 'Código inventário:'},
            {type: 'hidden', name: 'espaco', value: espacoid},
            {type: 'hidden', name: 'id'},
            {type: 'newcolumn', offset: 20},
            {type: 'label', label:'Foto das condições atuais', labelWidth:300, list:[
                {type: 'settings', inputWidth: 200},
                {type:'block', inputWidth: 700, list:[
                    {type: "image", name: "foto1", url:  "./ws/foto_itens_espaco.php"},
                    {type: 'newcolumn', offset: 0},
                    {type: "image", name: "foto2", url:  "./ws/foto_itens_espaco.php"},
                    {type: 'newcolumn', offset: 0},
                    {type: "image", name: "foto3", url:  "./ws/foto_itens_espaco.php"}
                ]}
            ]}
        ], function () {

        });

        form.attachEvent("onAfterValidate", function (status){

            if (status === false)
                return;

            cell.progressOn();

            let dados = form.getFormData();
            dados.responsavel = usuariocorrente.login;

            if (dados.id > 0) {
                espaco.Itens.Editar(dados, AoExecutarOperacao);
            } else {
                console.clear();
                console.debug(dados);
                espaco.Itens.Adicionar(dados, AoExecutarOperacao);
            }

        });

    };

    this.CarregaLista = function (lista) {

        grid = layout.cells('b').attachGrid();
        grid.setHeader(['Código','Nome', 'Quantidade', 'Observações']);
        grid.setColTypes('ro,ro,ro,ro');
        grid.setColSorting('str,str,str,str');
        grid.enableSmartRendering(true);
        grid.enableMultiselect(true);
        grid.init();

        grid.attachEvent("onRowSelect", function (id) {
            cell.progressOn();
            espaco.Itens.Info(id, function (infoitem) {

                cell.progressOff();

                if (infoitem === null)
                    return;

                let dados = infoitem[0];
                form.setFormData(dados);
            })
        });

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