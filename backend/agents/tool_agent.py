from backend.services.graph_gap_finder import GraphGapFinder
from backend.services.research_memory import ResearchMemory


class ToolAgent:

    def __init__(self):

        self.gaps=GraphGapFinder()

        self.memory=ResearchMemory()

    def execute(

        self,

        tool

    ):

        if tool=="gaps":

            return self.gaps.find_gaps()

        if tool=="memory":

            return self.memory.load()

        return {}