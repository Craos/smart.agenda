let ViewEspacoCadastro = function (espaco, cell) {

    let that = this, form;

    this.MontaFormulario = function () {

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
                        that.RemoverItem(form.getItemValue('id'), AoExecutarOperacao);
                        break;
                }
            }
        });


        cell.detachObject(true);
        form = cell.attachForm();
        form.loadStruct([
            {type: 'settings', offsetLeft:10, offsetTop:15, inputWidth:200, labelWidth:140, labelAlign: 'right'},
            {type: 'input', name: 'nome', required: true, label: 'Nome do espaço:'},
            {type: 'input', name: 'localizacao', label: 'Localização:'},
            {type: 'input', name: 'tempo_reserva', label: 'Temp. Reserva/Hs:'},
            {type: 'input', name: 'custo_hora', label: 'R$/Hora:'},
            {type: 'input', name: 'custo_hora_extra', label: 'R$/Adicionais:'},
            {type: 'input', name: 'custo_multa', label: 'R$/Multa:'},
            {type: "image", name: "foto1", label:'Foto/Logo:', url:  "./ws/foto.php",
                imageWidth: 200, imageHeight: 200,
                inputWidth: 205, inputHeight: 205},
            {type: 'hidden', name: 'id'},
            {type: 'newcolumn', offset: 20},
            {type: 'label', label:'Imagens do espaço', list:[
                {type: 'settings', inputWidth: 200},
                {type:'block', inputWidth: 700, list:[
                    {type: "image", name: "foto2", url:  "./ws/foto.php"},
                    {type: 'newcolumn', offset: 0},
                    {type: "image", name: "foto3", url:  "./ws/foto.php"},
                    {type: 'newcolumn', offset: 0},
                    {type: "image", name: "foto4", url:  "./ws/foto.php"}
                ]},
                {type:'block', inputWidth: 700, list:[
                    {type: "image", name: "foto5", url:  "./ws/foto.php"},
                    {type: 'newcolumn', offset: 0},
                    {type: "image", name: "foto6", url:  "./ws/foto.php"},
                    {type: 'newcolumn', offset: 0},
                    {type: "image", name: "foto7", url:  "./ws/foto.php"}
                ]},
                {type:'block', inputWidth: 700, list:[
                    {type: "image", name: "foto8", url:  "./ws/foto.php"},
                    {type: 'newcolumn', offset: 0},
                    {type: "image", name: "foto9", url:  "./ws/foto.php"},
                    {type: 'newcolumn', offset: 0},
                    {type: "image", name: "foto10", url:  "./ws/foto.php"}
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
            dados.custo_hora = converteMoedaFloat(dados.custo_hora);
            dados.custo_hora_extra = converteMoedaFloat(dados.custo_hora_extra);
            dados.custo_multa = converteMoedaFloat(dados.custo_multa);

            if (dados.id > 0) {
                espaco.Editar(dados, AoExecutarOperacao);
            } else {
                espaco.Adicionar(dados, AoExecutarOperacao);
            }

        });

    };

    this.CarregaInformacoes = function (info) {

       info.custo_hora = converteFloatMoeda(info.custo_hora);
       info.custo_hora_extra = converteFloatMoeda(info.custo_hora_extra);
       info.custo_multa = converteFloatMoeda(info.custo_multa);
       form.setFormData(info);

    };

    this.LimparFormulario = function() {

        form.clear();
        form.setFormData({});
        form.setItemValue('id', null);

    };

    this.RemoverItem = function(id, Callback) {

        cell.progressOn();
        dhtmlx.confirm({
            type:"confirm-warning",
            title:"Atenção",
            text:"Você confirma a exclusão do registro do espaço?",
            ok:"Sim", cancel:"Não",
            callback:function(result){

                if (result !== true)
                    return;

                webservice.Request({
                    process: 'query',
                    params: JSON.stringify({
                        command: 'delete',
                        from: 'smt.espacos.cadastro',
                        where: 'id='+id,
                        returning: 'id'
                    })
                }, function (http) {

                    if (http.response === 'null' || http.response === 'false') {
                        Callback(null);
                        return;
                    }

                    Callback(webservice.PreparaLista('query',http.response));
                });
            }
        });
    };

    function AoExecutarOperacao() {
        cell.progressOff();
        document.dispatchEvent(new CustomEvent('AoExecutarOperacaoCadastro', {
            detail: null
        }));
    }


};