import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const Filter = () => {
  const [jobLevels, setJobLevels] = useState("");
  const [bulkDataInput, setBulkDataInput] = useState("");
  const [outputData, setOutputData] = useState([]);
  const [splitDataChunks, setSplitDataChunks] = useState([]);
  const [copyButtonTexts, setCopyButtonTexts] = useState({});

  const parseInputData = () => {
    if (!bulkDataInput.trim()) {
      alert("Please paste data into the input field.");
      return [];
    }
    return bulkDataInput.split("\n").map((line) => {
      const [company, personID, jobLevel] = line
        .split("\t")
        .map((item) => item.trim());
      return {
        company,
        personID,
        jobLevel: jobLevel ? parseInt(jobLevel) : null,
      };
    });
  };

  const handleProcessData = () => {
    if (!jobLevels.trim() || !bulkDataInput.trim()) {
      alert("Both Job Level and Comp ID Person ID fields are mandatory.");
      return;
    }
    const parsedData = parseInputData();
    const jobLevelsArray = jobLevels ? jobLevels.split(",").map(Number) : [];

    const outputCounts = {};
    for (let maxCount = 1; maxCount <= 10; maxCount++) {
      const dict = {};
      let count = 0;

      parsedData.forEach((row) => {
        const { company, jobLevel } = row;
        if (
          jobLevelsArray.length &&
          jobLevel !== null &&
          !jobLevelsArray.includes(jobLevel)
        )
          return;
        if (!dict[company]) {
          dict[company] = 1;
          count++;
        } else if (dict[company] < maxCount) {
          dict[company]++;
          count++;
        }
      });

      outputCounts[maxCount] = count;
    }

    const userMaxCount = parseInt(
      prompt(
        `Output Counts (IDM_ID per Company 1 to 10):\n${Object.entries(
          outputCounts
        )
          .map(
            ([maxCount, count]) =>
              `IDM_ID ${maxCount} per company: ${count} Person_ID(s)`
          )
          .join("\n")}\n\nEnter the Max Count you want:`
      )
    );

    if (isNaN(userMaxCount) || userMaxCount < 1) {
      alert("Invalid max count selected.");
      return;
    }

    const dict = {};
    const processedData = parsedData.filter((row) => {
      const { company, jobLevel } = row;
      if (
        jobLevelsArray.length &&
        jobLevel !== null &&
        !jobLevelsArray.includes(jobLevel)
      )
        return false;

      if (!dict[company]) {
        dict[company] = 1;
        return true;
      } else if (dict[company] < userMaxCount) {
        dict[company]++;
        return true;
      }
      return false;
    });

    processedData.sort((a, b) => a.company.localeCompare(b.company));
    setOutputData(processedData);
  };

  const handleSplitData = () => {
    const chunkSize = 3000;
    const chunks = [];

    // Ensure outputData is an array
    if (!Array.isArray(outputData) || outputData.length === 0) {
      alert("No data available to split!");
      return;
    }

    // Split data into chunks
    for (let i = 0; i < outputData.length; i += chunkSize) {
      chunks.push(outputData.slice(i, i + chunkSize));
    }

    setSplitDataChunks(chunks); // Ensure state is an array of arrays
    console.log("splitDataChunks:", chunks); // Debugging
  };

  // Function to handle copying Comp_IDs to clipboard
  /*const copyCompIDsToClipboard = (chunkData) => {
    const compIDs = chunkData.map(row => row.company).join('\n');
    navigator.clipboard.writeText(compIDs);
  };*/

  useEffect(() => {
    const initialButtonTexts = splitDataChunks.reduce((acc, _, index) => {
      acc[index] = "Copy IDM_IDs to Clipboard";
      return acc;
    }, {});
    setCopyButtonTexts(initialButtonTexts);
  }, [splitDataChunks]);

  // Function to handle copying Indiv_IDs to clipboard
  const copyIndivIDsToClipboard = (chunkData, chunkIndex) => {
    const indivIDs = chunkData.map((row) => row.personID).join("\n");
    navigator.clipboard
      .writeText(indivIDs)
      .then(() => {
        // Set the text for the clicked chunk to "Copied!"
        setCopyButtonTexts((prevState) => {
          const updatedState = { ...prevState, [chunkIndex]: "Copied!" };
          console.log("Updated state:", updatedState); // Debugging
          return updatedState;
        });

        // Reset the button text after 2 seconds
        setTimeout(() => {
          setCopyButtonTexts((prevState) => {
            const resetState = {
              ...prevState,
              [chunkIndex]: "Copy IDM_IDs to Clipboard",
            };
            console.log("Reset state:", resetState); // Debugging
            return resetState;
          });
        }, 2000);
      })
      .catch((err) => {
        console.error("Clipboard copy failed:", err);
        alert("Failed to copy text. Please try again.");
      });
  };

  //The new code used for handling split data//

  const handleExportToExcel = () => {
    const rows = [["IDM Comp_ID", "IDM Indiv_ID", "Job_Level"]];
    outputData.forEach((row) => {
      rows.push([
        row.company,
        row.personID,
        row.jobLevel !== null ? row.jobLevel : "",
      ]);
    });

    const csvContent = `data:text/csv;charset=utf-8,${rows
      .map((e) => e.join(","))
      .join("\n")}`;
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "Processed_data.csv";
    link.click();
  };

  const handleReset = () => {
    setJobLevels("");
    setBulkDataInput("");
    setOutputData([]);
    setSplitDataChunks([]);
  };

  return (
    <div>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary bg-dark border-bottom fixed-top"
        data-bs-theme="dark"
      >
        <div className="container" style={{ marginLeft: "20px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <a className="navbar-brand" href="#">
              IBM APPS
            </a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarText">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  to="/filter"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <a className="nav-link active" aria-current="page" href="#">
                    IDM Filter
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="data" style={{ marginTop: "100px" }}>
        <h3>IDM Data Filter Tool</h3>

        <div className="joblev">
          <label htmlFor="jobLevels" style={{ fontSize: "18px" }}>
            Job Levels (optional, comma-separated):
          </label>
          <input
            className="form-control"
            id="jobLevels"
            type="text"
            placeholder="e.g., 1,2,3"
            aria-label="e.g., 1,2,3"
            style={{ width: "100px", marginBottom: "20px" }}
            value={jobLevels}
            onChange={(e) => setJobLevels(e.target.value)} // Set the state when input changes
          />
        </div>

        <div className="single">
          <p style={{ marginTop: "20px", fontSize: "18px" }}>
            Enter the IDM_Company_ID, IDM_ID, and Job level:-
          </p>
        </div>
      </div>

      <div className="form-floating">
        <textarea
          className="form-control bx--text-area"
          id="bulkDataInput"
          rows="10"
          cols="50"
          value={bulkDataInput} // Bind the state to the textarea
          onChange={(e) => setBulkDataInput(e.target.value)} // Handle input changes
        />
      </div>
      <div className="bt">
        <button
          className="btn btn-primary bnw"
          onClick={handleProcessData}
          disabled={!jobLevels.trim() || !bulkDataInput.trim()}
        >
          Process Data
        </button>
        <button
          className="btn btn-primary bmw"
          style={{ marginLeft: "20px" }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      <div>
        <h2
          style={{
            marginLeft: "50px",
            marginBottom: "20px",
            marginTop: "15px",
          }}
        >
          Processed Data
        </h2>
      </div>
      {outputData.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <button
            className="btn btn-secondary btg"
            onClick={handleExportToExcel}
          >
            Export to Excel
          </button>
          {outputData.length > 3000 && (
            <button className="btn btn-secondary btg" onClick={handleSplitData}>
              Split Data
            </button>
          )}
        </div>
      )}
      {/* Render Split Data */}
      {splitDataChunks.length > 0 &&
        splitDataChunks.map((chunk, index) => {
          if (!Array.isArray(chunk)) {
            console.error(`Expected an array, but got:`, chunk);
            return null;
          }

          return (
            <div
              style={{
                border: "1px solid #ccc",
                margin: "10px auto",
                padding: "10px",
                maxHeight: "200px",
                overflowY: "auto",
                width: "80%",
              }}
            >
              <h4 style={{ paddingTop: "15px" }}>Filter {index + 1} (3K)</h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <button
                  className="btn btn-success"
                  onClick={() => copyIndivIDsToClipboard(chunk, index)}
                >
                  {copyButtonTexts[index] || "Copy IDM_IDs to Clipboard"}
                </button>
                <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                  ({chunk.length} records)
                </span>
              </div>
              <table style={{ width: "100%", marginTop: "10px" }}>
                <thead>
                  <tr>
                    <th>IDM Comp_ID</th>
                    <th style={{ paddingLeft: "30px" }}>IDM_ID</th>
                    <th style={{ paddingLeft: "10px" }}>Job_Level</th>
                  </tr>
                </thead>
                <tbody>
                  {chunk.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td>{row.company}</td>
                      <td style={{ paddingLeft: "30px" }}>{row.personID}</td>
                      <td style={{ paddingLeft: "10px" }}>
                        {row.jobLevel !== null ? row.jobLevel : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
    </div>
  );
};

export default Filter;
