import process_image

def main():
    img_processor = process_image.process_image()
    img_processor.process("input_image.png")
    img_processor.detect_object()
    img_processor.remove_background()
    img_processor.enhance_image_option1()
    img_processor.enhance_image_option2()
    img_processor.enhance_image_option3()
    img_processor.choose_image(2)
    img_processor.generate_description()
    
if __name__ == "__main__":
    main()