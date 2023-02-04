import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import "../Components/LightHouse.css";
import File from "../images/icons/file2.png";
import File2 from "../images/icons/file.png";
import Lock from "../images/icons/lock.png"

import lighthouse from "@lighthouse-web3/sdk";
import { ethers } from "ethers";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LightHouse = () => {
  // ** API GOD_FATHER
  const API = "1e8ba22b-e3c5-4335-aadd-79b5f614ce0f";

  const { isConnected, isDisconnected, address } = useAccount();

  const [allUploads, setAllUploads] = useState();
  const [remainingBalance, setRemainingBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const uploads = await lighthouse.getUploads(address);
      console.log(uploads.data.uploads);
      setAllUploads(uploads.data.uploads);
      setLoading(true);
    };

    const getRemainingData = async () => {
      const balance = await lighthouse.getBalance(address);
      setRemainingBalance(balance.data);
      console.log(balance)
      setLoadingData(true)
    };

    fetchData();
    getRemainingData();
  }, [address]);


  // ** Some Convertion Functions
  const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  function convertBytesToKilobytes(bytes) {
    return (bytes / 1024).toFixed(1) + " KB";
  }
  function convertKBtoMB(kb) {
    return (kb / 1024).toFixed(2) + " MB";
  }

  const [simpleFile, setSimpleFile] = useState(null);
  const [encyptFile, setEncyptFile] = useState(null);
  const [inputRefSimple, setInputRefSimple] = useState(null);
  const [inputRefEncrypt, setInputRefEncrypt] = useState(null);
  // Construct with token and endpoint
  // ** TOASTER
  // * Cid Scan Scan URL
  const [cidScan, setCidScan] = useState("");
  const BaseUrl = "https://gateway.lighthouse.storage/ipfs/";
  const ShareUrl = "https://files.lighthouse.storage/viewFile/";
  const CloseButton = ({ closeToast }) => (
    <button
      style={{
        borderRadius: "15px",
        backgroundColor: "green",
        border: "solid 2px black",
        padding: "6px",
      }}
    >
      <a
        style={{ color: "white", textDecoration: "none" }}
        href={cidScan}
        onClick={closeToast}
        target="_blank"
      >
        Watch on Scan
      </a>
    </button>
  );

  // * Get that Uploaded Simple file and then saving it to a state so we can use later
  const handleSimpleFile = (e) => {
    console.log(e);
    setSimpleFile(e);
  };

  // * Get that Uploaded file which we will encrypt by using Lighthouse and then saving it to a state so we can use later
  const handleEncyptedFile = (e) => {
    setEncyptFile(e);
  };

  // * Use to upload a File by our custom Image
  const handleImageClick1 = () => {
    inputRefSimple.click();
  };

  const handleImageClick2 = () => {
    inputRefEncrypt.click();
  };

  // * Light House Upload Logic with the Progress Data (Simple File Upload)
  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };
  const deploy = async () => {
    // * Push file to lighthouse node
    const output = await lighthouse.upload(simpleFile, API, progressCallback);
    console.log("File Status:", output);

    const url = BaseUrl + output.data.Hash;
    setCidScan(url);
    toast.success(
      "File :" + " " + output.data.Name + " " + "Uploaded Successfully",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );

    /*
      output:
        {
          Name: "filename.txt",
          Size: 88000,
          Hash: "QmWNmn2gr4ZihNPqaC5oTeePsHvFtkWNpjY3cD6Fd5am1w"
        }
      Note: Hash in response is CID.
    */

    console.log(
      "Visit at https://gateway.lighthouse.storage/ipfs/" + output.data.Hash
    );
  };



  // * Light House Upload Logic with the Progress Data (Encypted File Upload)
  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };
  const progressCallback2 = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };
  /* Deploy file along with encryption */
  const deployEncrypted = async () => {
    /*
     uploadEncrypted(e, publicKey, accessToken, uploadProgressCallback)
     - e: js event
     - publicKey: wallets public key
     - accessToken: your api key
     - signedMessage: message signed by the owner of publicKey
     - uploadProgressCallback: function to get progress (optional)
  */
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      encyptFile,
      sig.publicKey,
      API,
      sig.signedMessage,
      progressCallback2
    );
    console.log(response);

    const url = BaseUrl + response.data.Hash;
    setCidScan(url);
    toast(
      "File :" +
      " " +
      response.data.Name +
      " " +
      "Successfully Encrypted CID" +
      response.data.Hash,
      {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );
  };

  // * Decrypt File after Giving CID

  const [fileURL, setFileURL] = React.useState(null);

  //** Decrypt CID input */
  const [Cid, setCID] = useState("");
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState("text");

  const handleChange = (event) => {
    setCID(event.target.value);
    if (event.target.value.length !== 46) {
      setError("Text must be at least 46 characters long");
    } else {
      setError("");
    }
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const sign_auth_message = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const publicKey = (await signer.getAddress()).toLowerCase();
    const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return { publicKey: publicKey, signedMessage: signedMessage };
  };
  /* Decrypt file */
  const decrypt = async () => {
    // Fetch file encryption key
    const cid = Cid; //replace with your IPFS CID
    const { publicKey, signedMessage } = await sign_auth_message();
    console.log(signedMessage);
    /*
      fetchEncryptionKey(cid, publicKey, signedMessage)
        Parameters:
          CID: CID of the file to decrypt
          publicKey: public key of the user who has access to file or owner
          signedMessage: message signed by the owner of publicKey
    */
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    );

    // Decrypt file

    // const fileType = "image/jpeg";
    const fileType = selectedOption;
    const decrypted = await lighthouse.decryptFile(
      cid,
      keyObject.data.key,
      fileType
    );
    console.log(decrypted);
    /*
      Response: blob
    */

    // View File
    const url = URL.createObjectURL(decrypted);
    console.log(url);
    setFileURL(url);
  };

  //* Share File by Giving the CID and the Wallet Address

  const [shareCid, setShareCid] = useState("");
  const [shareAddress, setShareAddress] = useState("");
  const [errorShare, setErrorShare] = useState("");
  const [errorAddress, setErrorAddress] = useState("");

  const handleShare = (event) => {
    setShareCid(event.target.value);
    if (event.target.value.length !== 46) {
      setErrorShare("Text must be at least 46 characters long");
    } else {
      setErrorShare("");
    }
  };

  const handleAddress = (event) => {
    setShareAddress(event.target.value);
    if (event.target.value.length !== 42) {
      setErrorAddress("Text must be at least 42 characters long");
    } else {
      setErrorAddress("");
    }
  };

  const signAuthMessage = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const publicKey = (await signer.getAddress()).toLowerCase();
    const messageRequested = (await lighthouse.getAuthMessage(publicKey)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return { publicKey: publicKey, signedMessage: signedMessage };
  };

  const shareFile = async () => {
    const cid = shareCid;

    // Then get auth message and sign
    // Note: message should be signed by owner of file.
    const { publicKey, signedMessage } = await signAuthMessage();

    const publicKeyUserB = [shareAddress];

    const res = await lighthouse.shareFile(
      publicKey,
      publicKeyUserB,
      cid,
      signedMessage
    );

    console.log(res);

    const url = ShareUrl + res.data.cid;
    setCidScan(url);

    toast("Successfully Shared with CID" + res.data.shareTo, {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    /*
      data: {
        cid: "QmTTa7rm2nMjz6wCj9pvRsadrCKyDXm5Vmd2YyBubCvGPi",
        shareTo: "0x201Bcc3217E5AA8e803B41d1F5B6695fFEbD5CeD"
      }
    */
    /*Visit: 
        https://files.lighthouse.storage/viewFile/<cid>  
      To view encrypted file
    */
  };



  //* Apply Access Control

  //* Apply for Access control


  const [accessCID, setAccessCID] = useState("");
  const [addressForAccess, setAddressForAccess] = useState("");
  const [value, setValue] = useState("");


  const handleAddressForAccess = (event) => {
    setAddressForAccess(event.target.value);
  };


  const handleCid = (event) => {
    setAccessCID(event.target.value);
  };

  const handleValue = (event) => {
    setValue(event.target.value);
  };



  const applyAccessConditions = async (e) => {
    const cid = accessCID;

    // Conditions to add
    const conditions = [
      {
        id: 1,
        chain: "Hyperspace",
        method: "balanceOf",
        standardContractType: "ERC721",
        contractAddress: addressForAccess,
        returnValueTest: { comparator: ">=", value: value },
        parameters: [":userAddress"],
      },

    ];

    const aggregator = "([1])";
    const { publicKey, signedMessage } = await encryptionSignature();

    const response = await lighthouse.accessCondition(
      publicKey,
      cid,
      signedMessage,
      conditions,
      aggregator
    );


    const url = BaseUrl + response.data.cid;
    setCID(url);


    toast.success(
      "Shared Succesfully with :" + " " + response.data.cid,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );

    console.log(response);

    // data: {
    //   cid: "QmZkEMF5y5Pq3n291fG45oyrmX8bwRh319MYvj7V4W4tNh",
    //   status: "Success"
    // }

  }


  return (
    <>
      <ToastContainer closeButton={CloseButton} />

      {isConnected && (
        <div>
          {loadingData && (
            <div>
              <h3 className="heading-storage">
                Data Remaining: {convertKBtoMB(remainingBalance.dataLimit)}
              </h3>
              <h3 className="heading-storage">
                Data Used: {convertKBtoMB(remainingBalance.dataUsed)}
              </h3>
            </div>
          )}

          <h3 className="heading">LightHouse Decentralized Storage</h3>

          {/* Simple File Upload  */}

          <div className="upload">
            <form className="files-upload">
              <img className="file-icon" src={File} onClick={handleImageClick1} />
              <input
                type="file"
                ref={(input) => setInputRefSimple(input)}
                onChange={handleSimpleFile}
                style={{ display: "none" }}
              />
              {!simpleFile && (
                <p className="box-text">Upload files (Simple Upload) </p>
              )}
              {simpleFile && (
                <p className="box-text">{simpleFile.target.files[0].name}</p>
              )}
              <a onClick={deploy} className="upload-btn">
                Upload File
              </a>
            </form>

            {/* Encrypted File Upload  */}
            <div className="encrypted-files-upload">
              <img className="file-icon" src={File} onClick={handleImageClick2} />
              <input
                type="file"
                ref={(input) => setInputRefEncrypt(input)}
                onChange={handleEncyptedFile}
                style={{ display: "none" }}
              />
              {!encyptFile && (
                <p className="box-text">Upload files you wanna (Encypt)</p>
              )}
              {encyptFile && (
                <p className="box-text">{encyptFile.target.files[0].name}</p>
              )}

              <a onClick={deployEncrypted} className="upload-btn">
                Upload File
              </a>
            </div>
          </div>

          {/* decrypt & share buttons */}

          <div className="form-btns">
            <h4 className="button-guide">
              Please enter the CID in the field below to decrypt your file. The
              CID is necessary for us to securely access and decrypt your file
            </h4>

            <form>
              <a onClick={decrypt} className="decrypt-btn">
                Decrypt File
              </a>

              <input
                className="cid-input"
                type="text"
                placeholder="Enter CID:"
                value={Cid}
                onChange={handleChange}
                maxLength={46}
              />

              {fileURL ? (
                <a href={fileURL} className="decrypt-btn" target="_blank">
                  viewFile
                </a>
              ) : null}

              {error && <p style={{ color: "red" }}>{error}</p>}

              <div className="checkbox">
                <input className="checkbox-txt"
                  type="radio"
                  value="text"
                  checked={selectedOption === "text"}
                  onChange={handleOptionChange}
                />
                (FileType) text
                <input
                  className="checkbox-img"
                  type="radio"
                  value="image/jpeg"
                  checked={selectedOption === "image/jpeg"}
                  onChange={handleOptionChange}
                />
                (FileType) image
              </div>
            </form>

            <h4 className="button-guide">
              Please enter the CID and the User Address You wanted to Share that
              File.
            </h4>

            <form className="button">
              <a onClick={shareFile} className="decrypt-btn">
                Share file
              </a>

              <input
                className="cid-input"
                type="text"
                placeholder="Enter CID:"
                value={shareCid}
                onChange={handleShare}
                maxLength={46}
              />
              {errorShare && <p style={{ color: "red" }}>{errorShare}</p>}

              <input
                className="cid-input"
                type="text"
                placeholder="Enter address:"
                value={shareAddress}
                onChange={handleAddress}
                maxLength={42}
              />
              {errorAddress && <p style={{ color: "red" }}>{errorAddress}</p>}
            </form>
          </div>

          {/* <div className="table-box">
            <div className="table-row table-head">
              <div className="table-cell first-cell">
                <p>Name</p>
              </div>
              <div className="table-cell">
                <p>CID</p>
              </div>
              <div className="table-cell last-cell">
                <p>Size</p>
              </div>
              <div className="table-cell last-cell">
                <p>Last Modified</p>
              </div>
            </div> */}

          {/* <table className="table-box">
            <thead>
              <tr className="table-row">
                <th>FileName</th>
                <th>FileType</th>
                <th>Encryption</th>
                <th>CID</th>
                <th>Size</th>
                <th>createdAt</th>
              </tr>
            </thead>
            {loading && (
              <tbody className="table-row">
                {allUploads.map((array, index) => (
                  <tr key={index} className="table-row">
                    <td>{array.fileName}</td>
                    <td c>{array.mimeType}</td>
                    {array.encryption === true ? <td> <img className="table-file" src={File2}/></td> : <td> <img className="table-lock" src={Lock}/> </td>}
                    <td>{array.cid}</td>
                    <td>{convertBytesToKilobytes(array.fileSizeInBytes)}</td>
                    <td>{convertTimestampToDate(array.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </table> */}
          {/* <td>{array.publicKey}</td> */}

          <div className="table">
            <table className="styled-table">
              <thead>
                <tr>
                  <th>FileName</th>
                  <th>FileType</th>
                  <th>Encryption</th>
                  <th>CID</th>
                  <th>Size</th>
                  <th>createdAt</th>
                </tr>
              </thead>
              {loading && (
                <tbody>
                  {allUploads.map((array, index) => (
                    <tr key={index} className='active-row'>
                      <td>{array.fileName}</td>
                      <td c>{array.mimeType}</td>
                      {array.encryption === true ? <td> <img className="table-file" src={Lock} /></td> : <td> <img className="table-lock" src={File2} /> </td>}
                      <td>{array.cid}</td>
                      <td>{convertBytesToKilobytes(array.fileSizeInBytes)}</td>
                      <td>{convertTimestampToDate(array.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>

              )}
            </table>

          </div>

          <div className="container">
            <div className="title">Add Access Condition</div>
            <div className="content">
              <form action="#">
                <div className="user-details">
                  <div className="input-box">
                    <span className="details">Chain</span>
                    <input type="text" placeholder="Hyperspace" disabled />
                  </div>
                  <div className="input-box">
                    <span className="details">Contract Type</span>
                    <input type="text" placeholder="ERC721" required disabled />
                  </div>
                  <div className="input-box">
                    <span className="details">Method</span>
                    <input type="text" placeholder="balanceOf" disabled />
                  </div>
                  <div className="input-box">
                    <span className="details">Contract Address</span>
                    <input type="text" onChange={handleAddressForAccess} maxLength={42} placeholder="Contract Address" />
                  </div>
                  <div className="input-box">
                    <span className="details">Comparator</span>
                    <input type="text" placeholder=">=" disabled />
                  </div>
                  <div className="input-box">
                    <span className="details">Value</span>
                    <input type="text" onChange={handleValue} placeholder="Value" required />
                  </div>
                  <div className="input-box">
                    <span className="details">Paramter</span>
                    <input type="text" placeholder=":userAddress" disabled />
                  </div>
                  <div className="input-box">
                    <span className="details">CID</span>
                    <input type="text" onChange={handleCid} placeholder="Enter Your Cid Here" maxLength={46} />
                  </div>

                </div>

                <div className="button">
                  <input className="applyAccessConditions" onClick={applyAccessConditions} value="Create Access Condition" />
                </div>
              </form>
            </div>
          </div>


        </div>
      )}
    </>
  );
};

export default LightHouse;
