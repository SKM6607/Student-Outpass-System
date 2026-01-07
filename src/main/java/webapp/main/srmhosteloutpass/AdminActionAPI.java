package webapp.main.srmhosteloutpass;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import webapp.main.srmhosteloutpass.utilities.DBConnector;
import webapp.main.srmhosteloutpass.utilities.StatusCodesEnum;

import java.io.IOException;
import java.sql.*;

@WebServlet("/adminAction")
public class AdminActionAPI extends HttpServlet {
    private static String statusOfOutpass(String s){
        for(StatusCodesEnum StatusCode: StatusCodesEnum.values()){
            if(s.equals(StatusCode.code)){
                return s;
            }
        }
        return null;
    }
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        String reqIdStr = req.getParameter("requestId");
        String action = req.getParameter("action");

        res.setContentType("text/plain");

        if (reqIdStr == null || action == null) {
            res.getWriter().print("missing_params");
            return;
        }

        int requestId;
        try {
            requestId = Integer.parseInt(reqIdStr);
        } catch (NumberFormatException ex) {
            res.getWriter().print("bad_id");
            return;
        }

        String newStatus = statusOfOutpass(action);
        try (Connection conn = DBConnector.getConnection()) {
            PreparedStatement ps = conn.prepareStatement(
                    "UPDATE outpass_requests SET status=? WHERE requestId=?"
            );
            ps.setString(1, newStatus);
            ps.setInt(2, requestId);
            int updated = ps.executeUpdate();
            if (updated > 0) {
                res.getWriter().print("success");
            } else {
                res.getWriter().print("not_found");
            }
        } catch (Exception e) {
            e.printStackTrace();
            res.getWriter().print("error");
        }
    }
}