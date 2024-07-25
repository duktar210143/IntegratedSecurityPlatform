import logging
import time
 
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
import random
 
# Configure logging
logging.basicConfig(level=logging.INFO)

options = webdriver.FirefoxOptions()
options.add_argument("-headless")

def select_random_option(driver, options, weights):
    selected_option = random.choices(options, weights=weights, k=1)[0]
    driver.execute_script("arguments[0].scrollIntoView(true);", selected_option)
    try:
        WebDriverWait(driver, 30).until(EC.element_to_be_clickable(selected_option))
        time.sleep(1)  # Wait for a short while to ensure the element is fully visible
        selected_option.click()
    except Exception as e:
        logging.error(f"Error selecting random option: {e}")

def fill_form(driver):
    driver.get("https://forms.gle/dmDuhiLErvzLSKda6")
    # Wait for the form to load
    try:
        WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.XPATH, '//*[@id="i5"]/div[3]/div')))
    except Exception as e:
        logging.error(f"Error waiting for form to load: {e}")
        return

    #first question
    first_options = [
        driver.find_element(By.XPATH, '//*[@id="i5"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i8"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i11"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i14"]/div[3]/div')
    ]
 
    first_weights = [0.2, 0.1, 0.1, 0.6]
    select_random_option(driver,first_options, first_weights)
 
    #second question
    second_options = [
        driver.find_element(By.XPATH, '//*[@id="i21"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i24"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i27"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i30"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i33"]/div[3]/div')
    ]
 
    second_weights = [0.1, 0.3,0.2,0.5,0.0]
    select_random_option(driver,second_options, second_weights)
 
    #third question
    third_options = [
        driver.find_element(By.XPATH, '//*[@id="i40"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i43"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i46"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i49"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i52"]/div[3]/div'),
    ]
 
    third_weights = [0.6, 0.2, 0.3, 0.2, 0.0]
    select_random_option(driver,third_options, third_weights)
 
    #fourth question
 
    fourth_options = [
        driver.find_element(By.XPATH, '//*[@id="i60"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i63"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i66"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i69"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i72"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i75"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i78"]/div[2]'),
    ]
 
    fourth_weights = [0.1, 0.4, 0.2, 0.2, 0.1, 0.3, 0.1]
    select_random_option(driver,fourth_options, fourth_weights)
 
    #fifth question
    fifth_options = [
        driver.find_element(By.XPATH, '//*[@id="i85"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i88"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i91"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i94"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i97"]/div[3]/div'),

        
    ]
 
    fifth_weights = [ 0.3,0.7,0.0,0.2,0.1]
    select_random_option(driver,fifth_options, fifth_weights)
 
 
    #sixth question
    sixth_options = [
        driver.find_element(By.XPATH, '//*[@id="i104"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i107"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i110"]/div[3]/div')
    ]
 
    sixth_weights = [0.7, 0.4, 0.2]
    select_random_option(driver,sixth_options, sixth_weights)
 
    #seventh question
    seventh_options = [
        driver.find_element(By.XPATH, '//*[@id="i117"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i120"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i123"]/div[3]/div')
    ]
 
    seventh_weights = [0.4, 0.8, 0.2]
    select_random_option(driver,seventh_options, seventh_weights)
 
    #eighth question
    eighth_options = [
        driver.find_element(By.XPATH, '//*[@id="i130"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i133"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i136"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i139"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i142"]/div[3]/div')

    ]
 
    eighth_weights = [0.1, 0.1, 0.2,0.7,0.5]
    select_random_option(driver,eighth_options, eighth_weights)
 
    #ninth question
    ninth_options = [
        driver.find_element(By.XPATH, '//*[@id="i149"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i152"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i155"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i158"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i161"]/div[3]/div')
    ]
 
    ninth_weights = [0.4, 0.7, 0.2,0.2,0.0]
    select_random_option(driver,ninth_options, ninth_weights)
 
    #tenth question
    tenth_options = [
        driver.find_element(By.XPATH, '//*[@id="i168"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i171"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i174"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i177"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i180"]/div[3]/div')
    ]
    tenth_weights = [0.3, 0.5, 0.2,0.0,0.0]
    select_random_option(driver,tenth_options, tenth_weights)
 
    #eleventh question
    eleventh_options = [
        driver.find_element(By.XPATH, '//*[@id="i187"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i190"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i193"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i196"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i199"]/div[3]/div')
    ]
 
    eleventh_weights = [0.7, 0.4, 0.2,0.0,0.0]
    select_random_option(driver,eleventh_options, eleventh_weights)
 
    #twelfth question
    twelfth_options = [
        driver.find_element(By.XPATH, '//*[@id="i206"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i209"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i212"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i215"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i218"]/div[3]/div')
    ]
 
    twelfth_weights = [0.0, 0.2,0.3,0.8,0.4]
    select_random_option(driver,twelfth_options, twelfth_weights)
 
    #thirteenth question
    thirteenth_options = [
        driver.find_element(By.XPATH, '//*[@id="i226"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i229"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i232"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i235"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i238"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i241"]/div[2]'),

    ]
 
    thirteenth_weights = [0.2,0.5,0.5,0.4,0.6,0.2]
    select_random_option(driver,thirteenth_options, thirteenth_weights)
 
 
    #fourteenth question
    fourteenth_options = [
        driver.find_element(By.XPATH, '//*[@id="i248"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i251"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i254"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i257"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i260"]/div[3]/div'),
    ]
    # //*[@id="i287"]/div[2]
 
    fourteenth_weights = [0.0,0.1,0.2,0.4,0.6]
    select_random_option(driver,fourteenth_options, fourteenth_weights)
 
    #fifteenth question
    fifteenth_options = [
        driver.find_element(By.XPATH, '//*[@id="i267"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i270"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i273"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i276"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i279"]/div[3]/div')

    ]
 
    fifteenth_weights = [0.0,0.2,0.2,0.7,0.4]
    select_random_option(driver,fifteenth_options, fifteenth_weights)
 
    #sixteenth question
    sixtheenth_options = [
        driver.find_element(By.XPATH, '//*[@id="i287"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i290"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i293"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i296"]/div[2]'),
        driver.find_element(By.XPATH, '//*[@id="i299"]/div[2]')

    ]
 
    sixtheenth_weights = [0.7, 0.3, 0.2,0.6,0.8]
    select_random_option(driver,sixtheenth_options, sixtheenth_weights)
 
    #seventeenth question
    seventeenth_options = [
        driver.find_element(By.XPATH, '//*[@id="i306"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i309"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i312"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i315"]/div[3]/div'),
    ]
 
    seventeenth_weights = [0.5,0.2,0.3,0.1]
    select_random_option(driver,seventeenth_options, seventeenth_weights)
 

     #eighteenth question
    eighteenth_options = [
        driver.find_element(By.XPATH, '//*[@id="i322"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i325"]/div[3]/div'),
        driver.find_element(By.XPATH, '//*[@id="i328"]/div[3]/div'),
    ]
 
    eighteenth_weights = [0.8, 0.1, 0.3]
    select_random_option(driver,eighteenth_options, eighteenth_weights)
 
 
 
    try:
        submit = driver.find_element(By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[3]/div/div[1]/div/span/span')
        submit.click()
    except Exception as e:
        logging.error(f"Error clicking submit button: {e}")
 
    #driver.close()
 
 
# Main loop to run the form-filling process
for i in range(50):
    driver = webdriver.Firefox(options=options)
    try:
        fill_form(driver)
    except Exception as e:
        logging.error(f"Error filling form: {e}")
    finally:
        driver.quit()
    time.sleep(2)

print("Completed filling the form 1 time.")


# import time
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.wait import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# import random

# options = webdriver.FirefoxOptions()
# options.add_argument("-headless")


# def select_random_option(driver,options, weights):
#     selected_option = random.choices(options, weights=weights, k=1)[0]
#     selected_option.click()

# def fill_form(driver):
#     driver.get("https://forms.gle/FUBcFCUZHnrXQxq2A")
#     # Wait for the form to load
#     WebDriverWait(driver, 10).until(
#         EC.presence_of_element_located((By.XPATH, '//*[@id="i5"]/div[3]/div'))
#     )

#     # First question
#     first_options = [
#         driver.find_element(By.XPATH, '//*[@id="i5"]/div[3]/div'),
#         driver.find_element(By.XPATH, '//*[@id="i8"]/div[3]/div'),
#         driver.find_element(By.XPATH, '//*[@id="i11"]/div[3]/div'),
#     ]

#     first_weights = [0.6, 0.1, 0.3]
#     select_random_option(driver,first_options, first_weights)

#     # # Second question
#     # second_options = [
#     #     driver.find_element(By.XPATH, '//div[@data-value="Option A"]'),
#     #     driver.find_element(By.XPATH, '//div[@data-value="Option B"]'),
#     # ]

#     # second_weights = [0.5, 0.2]
#     # select_random_option(driver, second_options, second_weights)

#     # Click submit button
#     submit = driver.find_element(By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[3]/div/div[1]/div/span/span')
#     submit.click()

# # Main loop to run the form-filling process 5 times
# for i in range(5):
#     driver = webdriver.Firefox(options=options)
#     fill_form(driver)
#     driver.quit()
#     time.sleep(2)

# print("Completed filling the form 5 times.")

# import time
# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.wait import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# import random

# options = webdriver.FirefoxOptions()
# options.add_argument("-headless")


# def select_random_option(driver, options, weights):
#     selected_option = random.choices(options, weights=weights, k=1)[0]
#     driver.execute_script("arguments[0].scrollIntoView(true);", selected_option)
#     WebDriverWait(driver, 10).until(EC.element_to_be_clickable(selected_option))
#     time.sleep(1)  # Wait for a short while to ensure the element is fully visible
#     selected_option.click()


# def fill_form(driver):
#     driver.get("https://forms.gle/FUBcFCUZHnrXQxq2A")
#     # Wait for the form to load
#     WebDriverWait(driver, 10).until(
#         EC.presence_of_element_located((By.XPATH, '//*[@id="i5"]/div[3]/div'))
#     )

#     # First question
#     first_options = [
#         driver.find_element(By.XPATH, '//*[@id="i5"]/div[3]/div'),
#         driver.find_element(By.XPATH, '//*[@id="i8"]/div[3]/div'),
#         driver.find_element(By.XPATH, '//*[@id="i11"]/div[3]/div'),
#     ]

#     first_weights = [0.6, 0.1, 0.3]
#     select_random_option(driver, first_options, first_weights)

#     # # Second question
#     # second_options = [
#     #     driver.find_element(By.XPATH, '//div[@data-value="Option A"]'),
#     #     driver.find_element(By.XPATH, '//div[@data-value="Option B"]'),
#     # ]

#     # second_weights = [0.5, 0.2]
#     # select_random_option(driver, second_options, second_weights)

#     # Click submit button
#     submit = driver.find_element(By.XPATH, '//*[@id="mG61Hd"]/div[2]/div/div[3]/div/div[1]/div/span/span')
#     driver.execute_script("arguments[0].scrollIntoView(true);", submit)
#     WebDriverWait(driver, 10).until(EC.element_to_be_clickable(submit))
#     time.sleep(1)  # Wait for a short while to ensure the element is fully visible
#     submit.click()


# # Main loop to run the form-filling process 5 times
# for i in range(15):
#     driver = webdriver.Firefox(options=options)
#     fill_form(driver)
#     driver.quit()
#     time.sleep(2)

# print("Completed filling the form 5 times.")

