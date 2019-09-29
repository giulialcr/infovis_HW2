import networkx as nx
import json
from networkx.readwrite import json_graph
import re

# per costruire json da graphml, per versione 3 d3js, vuole nei link il posto nella lista dei nodi

def replace_graph(id):
  if "h" in id:
    id=int(id.replace("h","1"))
  else:
    id=int(id.replace("m","2"))
  return id   

def position_list(id, lista_data_nodes):
  for item in lista_data_nodes:
    if (item['id']==id):
      return lista_data_nodes.index(item)

def parse1():

		G=nx.read_graphml('marvel_graph2.graphml', unicode)
		data = json_graph.node_link_data(G)
		print(data['nodes'][51])
		print(data['nodes'][39])
		#print(data['links'])

		# for node in data['nodes']:
		#   node['id']=replace_graph(node['id'])
		#   #print(node_id)
		#   for i in range(5):
		#     print(node[i])

		# for link in data['links']:

		#   link['source']=replace_graph(link['source'])

		#   link['target']=replace_graph(link['target'])

		for link in data['links']:
				link['source']=position_list(link['source'],data['nodes'] )
				link['target']=position_list(link['target'],data['nodes'])


		with open('YourFile5.json', 'w') as f:
				json.dump(data, f, indent=4)


testo='marvel_graph2.graphml'
parse1()