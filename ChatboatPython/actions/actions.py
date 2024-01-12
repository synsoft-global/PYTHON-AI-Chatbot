from typing import Text, List, Any, Dict
from rasa_sdk import Tracker, FormValidationAction, Action
from rasa_sdk.events import EventType
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.types import DomainDict
import requests
from rasa_sdk.events import AllSlotsReset
import spacy
from pathlib import Path
from datetime import datetime
from sanic.request import Request

api_url = 'https://dummyjson.com/products'

class ValidateSimpleBookingForm(FormValidationAction):
    def name(self) -> Text:
        return "validate_simple_booking_form"
        
    @staticmethod
    def is_past_date(self,date_text):
        try:
            # Convert the input date to a datetime object
            input_date = datetime.strptime(date_text, '%d/%m/%Y')

            # Get the current date
            current_date = datetime.now()

            # Compare the input date with the current date
            return input_date < current_date
        except ValueError:
            # If parsing fails, it's not a valid date
            return False
    
    @staticmethod
    def is_valid_date(self,date_text):
        try:
            # Attempt to parse the input text as a date
            datetime.strptime(date_text, '%d/%m/%Y')
            return True
        except ValueError:
            # If parsing fails, it's not a valid date
            return False

    def validate_first_name(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate `first_name` value."""
        doctorNumber = tracker.latest_message.get("doctorId")
          # Access the metadata field from the latest message
          
        metadata = tracker.latest_message.get("metadata")
        whatsapp_number = tracker.latest_message['metadata']

        # return {"first_name": None}
        if len(slot_value) <= 2:
            dispatcher.utter_message(text=f"That's a very short name. I'm assuming you mis-spelled.")
            return {"first_name": None}
        else:
            dispatcher.utter_message(text=f"Great! You have enter first name {slot_value} .")
            return {"first_name": slot_value}
 
    def validate_last_name(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate `last_name` value."""

        if len(slot_value) <= 2:
            dispatcher.utter_message(text=f"That's a very short name. I'm assuming you mis-spelled.")
            return {"last_name": None}
        else:
            dispatcher.utter_message(text=f"Great! You have enter last name {slot_value} .")
            return {"last_name": slot_value}

    def validate_date_of_birth(
        self,
        slot_value: Any,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: DomainDict,
    ) -> Dict[Text, Any]:
        """Validate `date_of_birth` value."""
      
        date_text = tracker.slots.get("date_of_birth")
        if self.is_valid_date(self,date_text):
            print(f"{date_text} is a valid date.")
            if self.is_past_date(self,date_text):
                print(f"{date_text} is a past date.")
            else:
                print(f"{date_text} is not a past date.")
                dispatcher.utter_message(text=f"You have enter invalid date of Birth.")
                return {"date_of_birth": None}
        else:
            print(f"{date_text} is not a valid date.")
            dispatcher.utter_message(text=f"{date_text} is not a valid date.")
            return {"date_of_birth": None}

        dispatcher.utter_message(text=f"Thanks for information To book an apointment please fill this form https://flixvalet.com/signup")
        return {"date_of_birth": slot_value}    
    
  
       
