# model/__init__.py

# Import all classes from object.py
from .object import *

# Or specifically import each class (recommended)
# from .object import (
#     FormLogin,
#     FormCreateAccount,
#     ActivateRequest,
#     User,
#     # ... other classes
# )

# You can also define what gets exported when someone does "from model import *"
# __all__ = [
#     'FormLogin',
#     'FormCreateAccount', 
#     'ActivateRequest',
#     'User',
#     # ... other class names
# ]