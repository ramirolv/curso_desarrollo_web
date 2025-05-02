from django.shortcuts import render

# Create your views here.
def BienvenidaView(request):
    return render(request, './index.html')

def DespedidaView(request):
    contexto = {
        "nombrePersona": "Jackeline",
        "edadPersona": 20
    }
    return render(request, './despedida.html', context=contexto)