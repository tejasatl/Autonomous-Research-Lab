from backend.llms.llm_factory import get_llm


class TimelineAgent:

    def __init__(self):

        self.llm = get_llm()

    def plan(
        self,
        topic
    ):

        prompt = f"""
Research topic:

{topic}

Generate a 16-week research timeline.

Week 1-2

Week 3-4

...

Week 15-16

Include milestones.

Return markdown.
"""

        return self.llm.generate(prompt)