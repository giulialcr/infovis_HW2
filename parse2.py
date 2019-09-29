import networkx as nx
import json
from networkx.readwrite import json_graph
import re

import json

# per costruire il json per il grafo hero to hero con  pesi


def peso_arco(nodo1,nodo2, dizionario_movie):
    i=0
    for heroList in dizionario_movie.values():
        if(nodo1 in heroList and nodo2 in heroList):
            i=i+1

    return i


def position_list(id, lista_data_nodes):
  for item in lista_data_nodes:
    if (item['id']==id):
      return lista_data_nodes.index(item)




with open("filehero.json") as read_file:
    data = json.load(read_file)

#print(data['nodes'])

data2={
    "directed": 'true', 
    "graph": {
        "node_default": {}, 
        "edge_default": {}
    },
    "nodes":[],
    "links":[],
    "multigraph": 'false'
}



dizionario_movie={}

for link in data['links']:
    if str(link['target']) in dizionario_movie:
        dizionario_movie[str(link['target'])].append(str(link['source']))
    else:
        dizionario_movie[str(link['target'])]=[str(link['source'])]
print(dizionario_movie)


lista1=[]

for nodo in data['nodes']:
    if nodo['type']=="hero":
        lista1.append(nodo)
data2['nodes']=lista1



lista=[]
for i in range(0,len(data['nodes'])):
    if (data['nodes'][i]['type']=="hero"):
        for j in range(i+1,len(data['nodes'])):
            if(data['nodes'][j]['type']=="hero"):
                peso=peso_arco(str(data['nodes'][i]['id']),str(data['nodes'][j]['id']),dizionario_movie)

                source=position_list(data['nodes'][i]['id'],lista1) #ritorna num nella lista dei nodi, per versione 3 di d3js
                target=position_list(data['nodes'][j]['id'],lista1) #ritorna num nella lista dei nodi, per versione 3 di d3js

                #print(peso)
                if peso>0:
                    # link={
                    #     "source": source, 
                    #     "target": target,
                    #     "weight": peso 
                    # }
                    link={
                        "source": data['nodes'][i]['id'], 
                        "target": data['nodes'][j]['id'],
                        "weight": peso 
                    }
                    lista.append(link)
                    
print(len(lista))
data2['links']=lista






with open('YourFile9.json', 'w') as f:
	json.dump(data2, f, indent=4)
