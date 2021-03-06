import unittest
import json
import os
import time
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys

class TestAllFeature(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        fixture = open(os.path.join(os.path.dirname(__file__), 'fixtures/notes.json'), 'r')
        notes = json.loads(fixture.read())
        fixture.close()

        cls.browser = webdriver.Firefox()
        cls.notes = notes
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
        for note in list(self.notes.values()):
            self.assertIsNotNone(self.find_element('.content__title', text=note['title']))
            self.assertIsNotNone(self.find_element('.content__preview', text=note['body']))

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

    def test_filtering_notes_then_enter_will_edit_selected(self):
        self.browser.get('http://localhost:8000')
        search_box = self.find_element('#content__search')

        search_box.send_keys('fir')
        search_box.send_keys(Keys.ENTER)

        textbox = self.find_element('#content-main__editor')

        expected_title = 'First notes'
        expected_content = 'First content'
        self.assertEqual(textbox.get_attribute('value'), '{}\n\n{}'.format(expected_title, expected_content))
        self.assertEqual(self.browser.switch_to.active_element, textbox)

    def test_filtering_notes_then_enter_will_create_new_notes_when_nothing_found(self):
        self.browser.get('http://localhost:8000')
        search_box = self.find_element('#content__search')

        search_box.send_keys('new notes')
        search_box.send_keys(Keys.ENTER)

        textbox = self.find_element('#content-main__editor')
        self.assertEqual(textbox.get_attribute('value'), 'new notes\n\n')
        self.assertEqual(self.browser.switch_to.active_element, textbox)

        self.assertEqual(search_box.get_attribute('value'), '')
        self.assertIsNotNone(self.find_element('.content__title', text='First notes'))
        self.assertIsNotNone(self.find_element('.content__title', text='Second notes'))
        self.assertIsNotNone(self.find_element('.content__title', text='Third notes'))
        self.assertIsNotNone(self.find_element('.content__title', text='new notes'))

        textbox.send_keys('this is new note')
        time.sleep(6)
        self.browser.refresh()
        self.assertIsNotNone(self.find_element('.content__title', text='new notes'))
        self.assertIsNotNone(self.find_element('.content__preview', text='this is new note'))


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
