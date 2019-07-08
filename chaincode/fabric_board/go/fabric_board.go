
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

type Board struct {
	Tittle   string `json:"tittle"`
	Content  string `json:"content"`
}

var board_count int

func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
    board_count = 0
	return shim.Success(nil)
}

func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	function, args := APIstub.GetFunctionAndParameters()
	if function == "queryBoard" {
		return s.queryBoard(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createBoard" {
		return s.createBoard(APIstub, args)
	} else if function == "queryAllBoard" {
		return s.queryAllBoard(APIstub)
	} else if function == "queryAllBoardView"{
		return s.queryAllBoardView(APIstub)
	}else if function == "deleteBoard"{
        return s.deleteBoard(APIstub, args)
    }else if function == "addBoard"{
             return s.addBoard(APIstub, args)
    }

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryBoard(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	carAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(carAsBytes)
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	cars := []Board{
		Board{Tittle: "테스트 제목입니다_01", Content: "테스트 내용입니다_01"},
		Board{Tittle: "테스트 제목입니다_02", Content: "테스트 내용입니다_02"},
		Board{Tittle: "테스트 제목입니다_03", Content: "테스트 내용입니다_03"},
		Board{Tittle: "테스트 제목입니다_04", Content: "테스트 내용입니다_04"},
	}

	i := 0
	for i < len(cars) {
		boardAsBytes, _ := json.Marshal(cars[i])
		APIstub.PutState("BOARD"+strconv.Itoa(i), boardAsBytes)
		i = i + 1
	}
    board_count = board_count +4
	return shim.Success(nil)
}

func (s *SmartContract) createBoard(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	var board = Board{Tittle: args[1], Content: args[2]}

	boardAsBytes, _ := json.Marshal(board)
	APIstub.PutState(args[0], boardAsBytes)
    board_count = board_count+1
	return shim.Success(nil)
}

func (s *SmartContract) deleteBoard(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var id = args[0]

	err := APIstub.DelState(id)

	if err != nil {
		return shim.Error("Failed to delete state")
	}
    err = APIstub.SetEvent("deleteevent", []byte("EventMessage"))
    if err != nil{
        return shim.Error(err.Error());
    }

	return shim.Success(nil)
}

func (s *SmartContract) queryAllBoard(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "BOARD0"
	endKey := "BOARD999"

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

func (s *SmartContract) queryAllBoardView(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "BOARD0"
	endKey := "BOARD999"

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
		var board_info Board
		err = json.Unmarshal(queryResponse.Value, &board_info)

		buffer.WriteString("Tittle :")
		buffer.WriteString(board_info.Tittle)

		buffer.WriteString("\tContent :")
		buffer.WriteString(board_info.Content+"\n")

	}
	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) addBoard(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}
	var board = Board{Tittle: args[0], Content: args[1]}


    boardAsBytes, _ := json.Marshal(board)
    //APIstub.PutState(args[0], boardAsBytes)
    APIstub.PutState("BOARD"+strconv.Itoa(board_count), boardAsBytes)
    board_count = board_count+1
    err := APIstub.SetEvent("myevent", []byte("EventMessage"))
    if err != nil{
        return shim.Error(err.Error());
    }
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
