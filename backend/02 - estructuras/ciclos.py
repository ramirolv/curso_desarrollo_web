repeticiones = 10
lista = [10, 15, 20, 4, 2]

for index in lista:
    print(f"Esta es una repeticion {index}")
    
intentos = 0

while intentos < 5:
    print("Intentos de while " + str(intentos))
    intentos = intentos + 1