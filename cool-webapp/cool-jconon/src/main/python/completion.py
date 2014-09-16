"""adds autocompletion in interactive mode"""
import rlcompleter
import readline
readline.parse_and_bind("tab: complete")
