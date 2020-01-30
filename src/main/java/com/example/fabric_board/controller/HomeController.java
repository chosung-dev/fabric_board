package com.example.fabric_board.controller;

import com.example.fabric_board.fabric.FabricController;
import org.hyperledger.fabric.sdk.exception.InvalidArgumentException;
import org.hyperledger.fabric.sdk.exception.ProposalException;
import org.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class HomeController {
    FabricController fbCon = new FabricController();
    public HomeController() throws Exception {

    }

    @RequestMapping("/")
    public String index(Model model) throws InvalidArgumentException, ProposalException {
        JSONArray board_json = fbCon.queryAllBoard();
        model.addAttribute("board_json", board_json);
        return "index";
    }

    @RequestMapping("/createboard")
    public String createboard(Model model) throws InvalidArgumentException, ProposalException {
        return "createboard";
    }

    @RequestMapping("/creatboard_submit")
    public String creatboard_submit(Model model, HttpServletRequest request) throws InvalidArgumentException, ProposalException {
        String tittle = request.getParameter("tittle");
        String content = request.getParameter("content");
        fbCon.addBoard(tittle, content);
        return index(model);
    }

    @RequestMapping("/delete")
    public String deleteBoard(Model model, HttpServletRequest request) throws InvalidArgumentException, ProposalException {
        String boardId = request.getParameter("board_id");
        fbCon.deleteBoard(boardId);
        return index(model);
    }

    @RequestMapping("/repair")
    public String repair(Model model, HttpServletRequest request) {
        String boardId = request.getParameter("board_id");
        model.addAttribute("boardId", boardId);
        return "repairboard";
    }

    @RequestMapping("/repairboard_submit")
    public String repairboard_submit(Model model, HttpServletRequest request) throws InvalidArgumentException, ProposalException {
        String boardId = request.getParameter("board_id");
        String tittle = request.getParameter("tittle");
        String content = request.getParameter("content");
        fbCon.repairBoard(boardId,tittle,content);
        return index(model);
    }
}
