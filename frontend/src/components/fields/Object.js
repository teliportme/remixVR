import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import SavingButton from '../SavingButton';
import ProjectStore from '../../stores/projectStore';
import ReactModal from 'react-modal';
import FieldLabel from '../FieldLabel';
import FieldInput from '../FieldInput';
import getAPIUrl from '../GetAPIUrl';

const ObjectGooglePoly = observer(({ field, spaceId }) => {
  const [enableUpload, setEnabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState([]);
  const projectStore = useContext(ProjectStore);
  const apiUrl = getAPIUrl();

  const uploadFile = event => {
    const file = event.target.files[0];
    const data = {};
    setEnabled(false);
    projectStore
      .updateField(spaceId, field.id, data, file)
      .then(() => setEnabled(true));
  };

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  const searchGooglePoly = event => {
    event.preventDefault();
    const API_KEY = '';
    const url = `https://poly.googleapis.com/v1/assets?keywords=${searchTerm}&format=OBJ&key=${API_KEY}`;

    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.addEventListener('load', function(event) {
      const data = JSON.parse(event.target.response);
      setAssets(data.assets);
    });
    request.send(null);
  };

  return (
    <React.Fragment>
      <FieldLabel htmlFor="file" className="f4 db ttc">
        {field.label}
      </FieldLabel>
      <FieldInput className="cf overflow-hidden">
        <div className="fl">
          <button
            className="f6 link dim br2 ph2 pv2 mv2 dib white bg-dark-gray pointer"
            onClick={openModal}
          >
            Select Model
          </button>
          <ReactModal
            appElement={document.body}
            isOpen={showModal}
            className="absolute shadow-2 bg-white br2 outline-0 pa2 top-2 bottom-1 left-1 right-1 overflow-scroll"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            onRequestClose={closeModal}
          >
            <React.Fragment>
              <form
                onSubmit={searchGooglePoly}
                className="center w-100 w-30-ns mt2 mb4"
              >
                <div className="cf">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                    }}
                    className="f6 f5-l input-reset bn fl black-80 bg-light-gray pa3 lh-solid w-100 w-60-m w-70-l br2-ns br--left-ns outline-0"
                    placeholder="Search"
                  />
                  <button
                    type="submit"
                    className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-40-m w-30-l br2-ns br--right-ns"
                  >
                    Search
                  </button>
                </div>
              </form>
              <div>
                {assets.map((asset, index) => (
                  <img
                    src={asset.thumbnail.url}
                    key={index}
                    className="w4 h4 ma2"
                  />
                ))}
              </div>
            </React.Fragment>
          </ReactModal>
          <SavingButton
            label
            htmlFor="file"
            disabled={!enableUpload}
            isLoading={!enableUpload}
            className="f6 link dim br2 ph2 pv2 mv2 dib white bg-dark-gray pointer"
          >
            {field.file && enableUpload ? `Replace` : 'Upload'}
          </SavingButton>
        </div>
        <div className="fl">
          {field.file && field.file.url && (
            <video
              alt="videosphere"
              src={apiUrl + field.file.url}
              controls
              className="w-100 outline-0 pointer"
            />
          )}
        </div>
      </FieldInput>
      {/* {
        logo && enabled &&
        <img src={logo.url} className="mw4 br1 pa2 bg-white-60 db" />
      } */}
    </React.Fragment>
  );
});

export default ObjectGooglePoly;