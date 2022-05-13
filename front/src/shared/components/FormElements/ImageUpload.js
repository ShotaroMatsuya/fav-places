import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  // to establish the connection of DOM element
  const filePickerRef = useRef();

  //   we want to generate a preview whenever we got a new file
  useEffect(() => {
    if (!file) {
      //fileが未選択になったとき
      return;
    }
    //   FileReader provided by browser Javascript to help us read files & to parse files
    // a file which is like a binary data into a readable or outputable image.
    const fileReader = new FileReader();
    //   once file reader loads a new file or is done parsing of file(readAsDataURL func) , this anonymous function will be executed.
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    //   create URL we can output the image
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    let pickedFile;
    let fileIsValid = isValid; //current state が反映されないことがあるので自分でvariableを更新する
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  const pickImageHandler = () => {
    // filePicker is opened
    filePickerRef.current.click();
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      {/* 'accept' is a default attribute you can add on inputs of type="file". */}
      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
