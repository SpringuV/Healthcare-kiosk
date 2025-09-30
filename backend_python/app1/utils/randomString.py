from app1.config import SPACE
from random import choices

def create_random_str(k: int):
    s = choices(SPACE, k=k)
    s = ''.join(s)
    return s