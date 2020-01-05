import unittest
import ipdb
import json
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys

class TestAllFeature(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.browser = webdriver.Firefox()
        cls.notes = [{'title': 'First notes', 'content': 'First content'}, {'title': 'Second notes', 'content': 'Second content'}, {'title': 'Third notes', 'content': 'Third content'}]
        cls.browser.get('http://localhost:8000')
        cls.browser.execute_script('window.localStorage.setItem(\'notes\', \'{}\')'.format(json.dumps(cls.notes)))

    @classmethod
    def tearDownClass(cls):
        cls.browser.quit()

    def setUp(self):
        self.browser = self.__class__.browser
        self.notes = self.__class__.notes

    def test_required_element_exists(self):
        self.browser.get('http://localhost:8000')
        self.assertIsNotNone(self.find_element('#content__search'))

    def test_all_saved_notes_are_listed(self):
        self.browser.get('http://localhost:8000')
        for note in self.notes:
            self.assertIsNotNone(self.find_element('.content__title', text=note['title']))
            self.assertIsNotNone(self.find_element('.content__preview', text=note['content']))

    def test_filtering_notes(self):
        self.browser.get('http://localhost:8000')
        search_box = self.find_element('#content__search')

        search_box.send_keys('fir')
        self.assertIsNone(self.find_element('.content__title', text='Second notes'))
        self.assertIsNone(self.find_element('.content__title', text='Third notes'))
        self.assertIsNotNone(self.find_element('.content__title', text='First notes'))

        search_box.send_keys(Keys.CONTROL, 'a')
        search_box.send_keys(Keys.BACKSPACE)
        self.assertIsNotNone(self.find_element('.content__title', text='First notes'))
        self.assertIsNotNone(self.find_element('.content__title', text='Second notes'))
        self.assertIsNotNone(self.find_element('.content__title', text='Third notes'))


    def find_element(self, selector, text=None):
        try:
            if text:
                elements = self.browser.find_elements_by_css_selector(selector)
                elements_with_text = [element for element in elements if element.text == text]
                if len(elements_with_text) == 0:
                    raise NoSuchElementException
                else:
                    return elements_with_text[0]
            else:
                return self.browser.find_element_by_css_selector(selector)

        except NoSuchElementException:
            return None

if __name__ == '__main__':
    unittest.main()
