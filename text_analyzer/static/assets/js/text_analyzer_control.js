function load_analysis(input_url, input_language, input_doc_mode) {
	let url = window.location + "api/v1/text_analysis/";
	console.log(url, input_language, input_doc_mode);

	$.ajax({
		// POST PETICION HACIA LA API DE DJANGO PARA TRAER LA INFORMACION PROCESO EN BASE A LA URL DE ENTRADA
		type: 'POST',
		url: url,
		data: {
			url: input_url,
			lan_mode: input_language,
			doc_mode: input_doc_mode,
			csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
		},
		cache: false,
		success: function (response) {
			console.log('Success');
			console.log(response);
			$('#loading').hide();
			// SENTIMENT SECTION
			$('#data_sentiment_analysis tr').remove();
			Object.entries(response.sentiment).forEach(function ([key, value]) {
				if (key === 'text') {
					value = value.substring(0, 60);
				}
				$('#data_sentiment_analysis').append('<tr><td>' + key + '</td><td>' + value + '</td></tr>');
			});
			// CLASSIFICATION SECTION
			$('#data_classifications_analysis tr').remove();
			Object.entries(response.classifications).forEach(function ([key, value]) {
				if (key === 'categories') {
					for (let x = 0; x < value.length; x++) {
						Object.entries(value[x]).forEach(function ([key2, value2]) {
							if (key2 === "label") {
								$('#data_classifications_analysis').append('<tr><td>' + key2 + '</td><td>' + value2 + '</td></tr>');
							}
						});
					}
				}
			});
			// ENTITIES SECTION
			$('#data_entities_analysis h3').remove();
			$('#data_entities_analysis ul').remove();
			$('#data_entities_analysis li').remove();
			Object.entries(response.entities).forEach(function ([key, value]) {
				if (key === 'entities') {
						Object.entries(value).forEach(function ([key2, value2]) {
							$('#data_entities_analysis').append('<h4>'+ key2 +'</h4>');
							$('#data_entities_analysis').append('<ul>');
							for (let x=0 ;x < value2.length; x++){
								$('#data_entities_analysis').append('<li>'+ value2[x] +'</li>');
							}
							$('#data_entities_analysis').append('</ul>');
						});
				}
			});
			// CONCEPTS SECTION
			$('#data_concepts_analysis tr').remove();
			Object.entries(response.concepts).forEach(function ([key, value]) {
				if (key === 'concepts') {
						Object.entries(value).forEach(function ([key2, value2]) {
							$('#data_concepts_analysis').append('<tr><td><a href="'+ key2+ '">' + value2.surfaceForms[0].string + '</a></td><td>' + value2.surfaceForms[0].score + '</td></tr>');
						});
				}
			});
			// SUMMARY SECTION
			$('#data_summary_analysis tr').remove();
			Object.entries(response.summary).forEach(function ([key, value]) {
				if (key === 'sentences') {
					for(let x = 0; x < value.length; x++){
						$('#data_summary_analysis').append('<tr><td>' + (x + 1) + '</td><td>' + value[x] + '</td></tr>');
					}
				}
			});
		},
	});
}

function get_list_language_doc() {
	return [{
			"name": "Automatic",
			"abbreviation": "auto"
		}, {
			"name": "Ingles",
			"abbreviation": "en"
		}
	];
}

function get_list_language_tweet() {
	return [{
			"name": "Automatic",
			"abbreviation": "auto"
		}, {
			"name": "Ingles",
			"abbreviation": "en"
		}, {
			"name": "Alemán",
			"abbreviation": "de"
		}, {
			"name": "Español",
			"abbreviation": "es"
		}
	];
}

function fill_language_dropdown_list() {
	$("#lang_mode").empty();
	if ($("#doc_mode :selected").val() === 'document') {
		let list_language_doc = get_list_language_doc();
		for (let x = 0; x < list_language_doc.length; x++) {
			$("#lang_mode").append($('<option></option>').attr('value', list_language_doc[x].abbreviation).text(list_language_doc[x].name));
		}
	} else {
		let list_language_tweet = get_list_language_tweet();
		for (let x = 0; x < list_language_tweet.length; x++) {
			$("#lang_mode").append($('<option></option>').attr('value', list_language_tweet[x].abbreviation).text(list_language_tweet[x].name));
		}
	}
}
$(document).ready(function () {
	// ESTE HIDE DESHABILITA EL BLOQUE HTML DE CARGA DEL CODIGO HTML
	$('#loading').hide();
	//
	
	//AL BOTON DE SUBMIT QUE EJECUTA LA PETICION POST HACIA DJANGO, SE LO DESHABILITA SI NO HAY NINGUNA INFORMACION EN EL INPUT
	$('#bttnsubmit').attr('disabled', 'disabled');
	$('input[type="text"]').keyup(function () {
		if ($(this).val() != '') {
			$('input[type="submit"]').removeAttr('disabled');
		} else {
			$('input[type="submit"]').attr('disabled', 'disabled');
		}
	});

	//EL EVENTO DEL BOTON SUBMIT, AQUI COMIENZA LA PETICION POST HACIA DJANGO, EJECUTANDO EL METODO load_analysis
	$("#bttnsubmit").click(function () {
		$('#loading').show();
		load_analysis($('input[type="text"]').val(), $("#lang_mode :selected").val(), $("#doc_mode :selected").val());
	});

	//EN ESTE BLOQUE SE RELLENA LA INFORMACION DE LOS DROPDOWM LIST, YA QUE ESTA INFORMACION ES DINAMICA, CAMBIA DE ACUERDA A QUE TIPO DE DOCUMENTO SE PROCESA
	fill_language_dropdown_list()
	$("#doc_mode").change(function () {
		fill_language_dropdown_list()
	});

});
