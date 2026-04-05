import requests
import numpy as np
import cv2

url = "https://res.cloudinary.com/dzoppqvhy/image/upload/v1774542331/to9tizrtrmzjqkakzegx.jpg"

response = requests.get(url)
image_array = np.asarray(bytearray(response.content), dtype=np.uint8)
image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

if image is None:
    print("فشل تحميل الصورة")
else:
    print("الصورة اتحملت بنجاح")
    print("Shape:", image.shape)

    cv2.imshow("Student Image", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()