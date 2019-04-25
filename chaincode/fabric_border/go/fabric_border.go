
package main


import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type SmartContract struct {
}

type Border struct {
	Tittle   string `json:"tittle"`
	Content  string `json:"content"`
}

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	function, args := APIstub.GetFunctionAndParameters()
	if function == "queryBorder" {
		return s.queryBorder(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createBord" {
		return s.createBord(APIstub, args)
	} else if function == "queryAllBord" {
		return s.queryAllBord(APIstub)
	} else if function == "queryAllBordView"{
		return s.queryAllBordView(APIstub)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryBorder(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(carAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	cars := []Border{
		Border{Tittle: "테스트 제목입니다_01", Content: "테스트 내용입니다_01"},
		Border{Tittle: "테스트 제목입니다_02", Content: "테스트 내용입니다_02"},
		Border{Tittle: "테스트 제목입니다_03", Content: "테스트 내용입니다_03"},
		Border{Tittle: "테스트 제목입니다_04", Content: "테스트 내용입니다_04"},
	}

	i := 0
	for i < len(cars) {
		borderAsBytes, _ := json.Marshal(cars[i])
		APIstub.PutState("BORDER"+strconv.Itoa(i), borderAsBytes)
		i = i + 1
	}

	return shim.Success(nil)
}

func (s *SmartContract) createBord(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	var bord = Border{Tittle: args[1], Content: args[2]}

	bordAsBytes, _ := json.Marshal(bord)
	APIstub.PutState(args[0], bordAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryAllBord(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "BORDER0"
	endKey := "BORDER999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllCars:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) queryAllBordView(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "BORDER0"
	endKey := "BORDER999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		var bord_info Border
		err = json.Unmarshal(queryResponse.Value, &bord_info)

		buffer.WriteString("Tittle :")
		buffer.WriteString(bord_info.Tittle)

		buffer.WriteString("\tContent :")
		buffer.WriteString(bord_info.Content+"\n")

	}
	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) addBord(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	var bord = Border{Tittle: args[0], Content: args[1]}


    startKey := "BORDER0"
    endKey := "BORDER999"
    resultsIterator, _ := APIstub.GetStateByRange(startKey, endKey)

    i := 0
    for resultsIterator.HasNext() {
       resultsIterator.Next()
       i = i + 1
    }
    resultsIterator.Close()

    bordAsBytes, _ := json.Marshal(bord)
    //APIstub.PutState(args[0], bordAsBytes)
    APIstub.PutState("BORDER"+strconv.Itoa(i), bordAsBytes)

	return shim.Success(nil)
}

// main함수는 테스트에서만 사용이 됩니다.
func main() {
	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
