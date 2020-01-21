from django.shortcuts import render
from aylienapiclient import textapi
from django.http import JsonResponse
from urllib.error import HTTPError


# Create your views here.
def user_name(request):
    '''Se renderiza la pagina donde se analiza la URL'''
    return render(request, 'text_analyzer/text_analyzer.html', None)


def get_text_analysis(request):
    '''Las peticiones a la API de aylien NPL, se maneja en este bloque, gracias a la misma libreria de Aylien'''

    if request.method == "POST":
        client = textapi.Client("7f7fa068", "542f6d6d104e67cb2dbf42920bfa625c")
        try:
            sentiment = client.Sentiment({
                'url': str(request.POST["url"]), 
                'language': str(request.POST["lan_mode"]),
                'mode': str(request.POST["doc_mode"]),
                })

            classifications = client.Classify({
                'url': str(request.POST["url"]), 
                'language': str(request.POST["lan_mode"])
                })
            entities = client.Entities({
                'url': str(request.POST["url"]), 
                'language': str(request.POST["lan_mode"])
                })
            concepts = client.Concepts({
                'url': str(request.POST["url"]), 
                'language': str(request.POST["lan_mode"])
                })
            summary = client.Summarize({
                'url': str(request.POST["url"]), 
                'language': str(request.POST["lan_mode"]),
                'sentences_number': 5
                })
        except:
            print("*"*50)
            print("Bad Input!! Please Verify your URL")
            print("*"*50)
            return JsonResponse({
                'sentiment':{}, 
                'classifications':{},
                'entities':{},
                'concepts':{},
                'summary':{}
                }, safe=False)
        return JsonResponse({
            'sentiment':sentiment, 
            'classifications':classifications,
            'entities':entities,
            'concepts':concepts,
            'summary':summary
            }, safe=False)
    else:
        return JsonResponse({}, safe=False)